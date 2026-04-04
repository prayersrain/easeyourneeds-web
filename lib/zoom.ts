/**
 * Zoom API Integration - Server-to-Server OAuth
 * 
 * Handles:
 * - OAuth token management
 * - Meeting creation/update/end
 * - Recording management
 * - Account pool selection
 */

const ZOOM_BASE_URL = "https://api.zoom.us/v2";

// ============================================================
// TOKEN MANAGEMENT
// ============================================================

interface ZoomTokenResponse {
  access_token: string;
  expires_in: number;
  token_type: "bearer";
  scope: string;
}

let cachedToken: { token: string; expiresAt: number } | null = null;

/**
 * Get Zoom access token using Server-to-Server OAuth
 * Tokens are cached to avoid unnecessary API calls
 */
async function getZoomAccessToken(): Promise<string> {
  // Return cached token if still valid
  if (cachedToken && Date.now() < cachedToken.expiresAt) {
    return cachedToken.token;
  }

  const accountId = process.env.ZOOM_ACCOUNT_ID;
  const clientId = process.env.ZOOM_CLIENT_ID;
  const clientSecret = process.env.ZOOM_CLIENT_SECRET;

  if (!accountId || !clientId || !clientSecret) {
    throw new Error("Zoom credentials not configured (ZOOM_ACCOUNT_ID, ZOOM_CLIENT_ID, ZOOM_CLIENT_SECRET)");
  }

  const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");

  const response = await fetch(
    `https://zoom.us/oauth/token?grant_type=account_credentials&account_id=${accountId}`,
    {
      method: "POST",
      headers: {
        Authorization: `Basic ${credentials}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Zoom token request failed: ${error}`);
  }

  const data: ZoomTokenResponse = await response.json();

  // Cache token with 5-minute buffer before actual expiry
  const expiresAt = Date.now() + (data.expires_in - 300) * 1000;
  cachedToken = { token: data.access_token, expiresAt };

  return data.access_token;
}

/**
 * Make authenticated request to Zoom API
 */
async function zoomRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const accessToken = await getZoomAccessToken();

  const response = await fetch(`${ZOOM_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    let errorMessage = `Zoom API error (${response.status})`;
    
    try {
      const errorJson = JSON.parse(errorText);
      errorMessage += `: ${errorJson.message || errorText}`;
    } catch {
      errorMessage += `: ${errorText}`;
    }

    throw new Error(errorMessage);
  }

  // Handle 204 No Content
  if (response.status === 204) {
    return {} as T;
  }

  return response.json() as Promise<T>;
}

// ============================================================
// MEETING MANAGEMENT
// ============================================================

export interface CreateMeetingParams {
  topic: string;
  type: 2; // Scheduled meeting
  start_time: string; // ISO 8601 format
  duration: number; // in minutes
  timezone: string;
  password?: string;
  agenda?: string;
  settings: {
    host_video?: boolean;
    participant_video?: boolean;
    cn_meeting?: boolean;
    in_meeting?: boolean;
    join_before_host?: boolean;
    mute_upon_entry?: boolean;
    watermark?: boolean;
    use_pmi?: boolean;
    approval_type?: 0 | 1 | 2; // 0=auto, 1=manual, 2=none
    registration_type?: 0 | 1 | 2; // 0=none, 1=required, 2=optional
    audio?: "both" | "telephony" | "voip";
    auto_recording?: "none" | "local" | "cloud";
    enforce_login?: boolean;
    enforce_login_domains?: string;
    alternative_hosts?: string;
    close_registration?: boolean;
    show_share_button?: boolean;
    allow_multiple_devices?: boolean;
    waiting_room?: number; // 0=off, 1=on, 2=external only
    meeting_authentication?: boolean;
    authentication_option?: string;
    authentication_domains?: string;
    alternative_host_update_polls?: boolean;
    capacity?: number;
  };
}

export interface MeetingResponse {
  uuid: string;
  id: number;
  host_id: string;
  host_email: string;
  topic: string;
  type: number;
  status: string;
  start_time: string;
  duration: number;
  timezone: string;
  created_at: string;
  join_url: string;
  start_url: string;
  password: string;
  h323_password: string;
  pstn_password: string;
  settings: {
    host_video: boolean;
    participant_video: boolean;
    waiting_room: number;
    join_before_host: boolean;
    mute_upon_entry: boolean;
    watermark: boolean;
    use_pmi: boolean;
    auto_recording: string;
    approval_type: number;
    registration_type: number;
    audio: string;
    enforce_login: boolean;
    meeting_authentication: boolean;
    alternative_hosts: string;
    close_registration: boolean;
    show_share_button: boolean;
    allow_multiple_devices: boolean;
  };
}

/**
 * Create a Zoom meeting for a specific user
 */
export async function createMeeting(
  hostEmail: string,
  params: CreateMeetingParams
): Promise<MeetingResponse> {
  return zoomRequest<MeetingResponse>(`/users/${hostEmail}/meetings`, {
    method: "POST",
    body: JSON.stringify(params),
  });
}

/**
 * Update an existing meeting
 */
export async function updateMeeting(
  meetingId: string,
  params: Partial<CreateMeetingParams>
): Promise<void> {
  await zoomRequest<void>(`/meetings/${meetingId}`, {
    method: "PATCH",
    body: JSON.stringify(params),
  });
}

/**
 * End a meeting immediately
 */
export async function endMeeting(meetingId: string): Promise<void> {
  await zoomRequest<void>(`/meetings/${meetingId}/status`, {
    method: "PUT",
    body: JSON.stringify({ action: "end" }),
  });
}

/**
 * Delete a meeting (before it starts)
 */
export async function deleteMeeting(meetingId: string): Promise<void> {
  await zoomRequest<void>(`/meetings/${meetingId}`, {
    method: "DELETE",
  });
}

/**
 * Get meeting details
 */
export async function getMeetingDetails(meetingId: string): Promise<MeetingResponse> {
  return zoomRequest<MeetingResponse>(`/meetings/${meetingId}`);
}

// ============================================================
// RECORDING MANAGEMENT
// ============================================================

export interface RecordingResponse {
  uuid: string;
  id: number;
  account_id: string;
  host_id: string;
  topic: string;
  start_time: string;
  duration: number;
  total_size: number;
  recording_count: number;
  recording_files: Array<{
    id: string;
    meeting_id: string;
    recording_start: string;
    recording_end: string;
    file_type: string;
    file_size: number;
    download_url: string;
    play_url: string;
    status: string;
    recording_type: string;
  }>;
}

/**
 * Get meeting recordings
 */
export async function getRecordings(meetingId: string): Promise<RecordingResponse> {
  return zoomRequest<RecordingResponse>(`/meetings/${meetingId}/recordings`);
}

/**
 * Delete a recording
 */
export async function deleteRecording(
  meetingId: string,
  recordingId: string
): Promise<void> {
  await zoomRequest<void>(`/meetings/${meetingId}/recordings/${recordingId}`, {
    method: "DELETE",
  });
}

// ============================================================
// USER MANAGEMENT
// ============================================================

export interface ZoomUser {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  type: number;
  role_name: string;
  pmi: number;
  use_pmi: boolean;
  vanity_url: string;
  personal_meeting_url: string;
  timezone: string;
  verified: number;
  dept: string;
  created_at: string;
  last_login_time: string;
  last_client_version: string;
  pic_url: string;
  host_key: string;
  jid: string;
  group_ids: string[];
  im_group_ids: string[];
}

/**
 * Get user details by email
 */
export async function getZoomUser(email: string): Promise<ZoomUser> {
  return zoomRequest<ZoomUser>(`/users/${email}`);
}

/**
 * List all users in the Zoom account
 */
export async function listZoomUsers(
  status: "active" | "pending" | "inactive" = "active"
): Promise<{ users: ZoomUser[]; page_count: number; page_number: number; page_size: number; total_records: number }> {
  return zoomRequest(`/users?status=${status}&page_size=300`);
}

// ============================================================
// ACCOUNT POOL SELECTION
// ============================================================

import pool from "@/lib/db";

interface ZoomAccount {
  id: string;
  account_id: string;
  account_email: string;
  daily_limit: number;
  daily_usage: number;
  concurrent_limit: number;
  current_concurrent: number;
  status: string;
  is_backup: boolean;
  account_tier: string;
}

/**
 * Select the best Zoom account for a new booking
 * 
 * Algorithm:
 * 1. Filter active, non-backup accounts
 * 2. Exclude accounts that have reached daily limit
 * 3. Exclude accounts that have reached concurrent limit
 * 4. Select account with lowest current usage (load balancing)
 */
export async function selectZoomAccount(
  startTime: Date,
  endTime: Date
): Promise<ZoomAccount> {
  // Get all active, non-backup accounts with their current usage
  const { rows } = await pool.query<ZoomAccount>(`
    SELECT 
      id,
      account_id,
      account_email,
      daily_limit,
      daily_usage,
      concurrent_limit,
      current_concurrent,
      status,
      is_backup,
      account_tier
    FROM zoom_accounts
    WHERE status = 'active'
      AND is_backup = FALSE
    ORDER BY daily_usage ASC
  `);

  if (rows.length === 0) {
    throw new Error("No active Zoom accounts available");
  }

  // Check for overlapping meetings to determine actual concurrent usage
  const availableAccounts = await Promise.all(
    rows.map(async (account) => {
      // Check daily limit
      if (account.daily_usage >= account.daily_limit) {
        return null;
      }

      // Check concurrent limit by counting overlapping meetings
      const { rows: concurrentMeetings } = await pool.query(`
        SELECT COUNT(*) as count
        FROM bookings
        WHERE zoom_account_id = $1
          AND status IN ('upcoming', 'in_progress')
          AND start_time <= $2
          AND end_time > $3
      `, [account.id, endTime, startTime]);

      const currentConcurrent = parseInt(concurrentMeetings[0].count);
      
      if (currentConcurrent >= account.concurrent_limit) {
        return null;
      }

      return { ...account, currentConcurrent };
    })
  );

  const validAccounts = availableAccounts.filter(Boolean) as (ZoomAccount & { currentConcurrent: number })[];

  if (validAccounts.length === 0) {
    // Try to use backup accounts if available
    const { rows: backupAccounts } = await pool.query<ZoomAccount>(`
      SELECT *
      FROM zoom_accounts
      WHERE status = 'active'
        AND is_backup = TRUE
      ORDER BY daily_usage ASC
      LIMIT 1
    `);

    if (backupAccounts.length === 0) {
      throw new Error("All Zoom accounts are at capacity. Please try again later or contact support.");
    }

    return backupAccounts[0];
  }

  // Select account with lowest usage (load balancing)
  return validAccounts.sort((a, b) => a.daily_usage - b.daily_usage)[0];
}

/**
 * Increment daily usage for a Zoom account
 */
export async function incrementZoomAccountUsage(accountId: string): Promise<void> {
  await pool.query(`
    UPDATE zoom_accounts
    SET 
      daily_usage = daily_usage + 1,
      current_concurrent = current_concurrent + 1,
      updated_at = NOW()
    WHERE id = $1
  `, [accountId]);
}

/**
 * Decrement concurrent usage when meeting ends
 */
export async function decrementZoomAccountConcurrent(accountId: string): Promise<void> {
  await pool.query(`
    UPDATE zoom_accounts
    SET 
      current_concurrent = GREATEST(current_concurrent - 1, 0),
      updated_at = NOW()
    WHERE id = $1
  `, [accountId]);
}

/**
 * Reset daily usage (should be called by cron job daily)
 */
export async function resetDailyZoomUsage(): Promise<void> {
  await pool.query(`
    UPDATE zoom_accounts
    SET 
      daily_usage = 0,
      current_concurrent = 0,
      updated_at = NOW()
  `);
}

// ============================================================
// MEETING CREATION HELPER (Full Flow)
// ============================================================

export interface BookingMeetingParams {
  topic: string;
  description?: string;
  startTime: Date;
  endTime: Date;
  capacity: number;
  meetingType: "pro" | "webinar";
  quality: "hd" | "full_hd";
  autoRecording: "none" | "local" | "cloud";
  enableWaitingRoom: boolean;
  hostEmail?: string; // Optional: use specific host email
}

/**
 * Complete flow: select account + create meeting
 * 
 * Returns meeting details ready to be saved to bookings table
 */
export async function createBookingMeeting(
  params: BookingMeetingParams
): Promise<{
  zoomAccountId: string;
  zoomAccountIdStr: string;
  zoomMeetingId: string;
  joinUrl: string;
  startUrl: string;
  hostkey: string;
  passcode: string;
  meetingDetails: MeetingResponse;
}> {
  // 1. Select best Zoom account
  const account = await selectZoomAccount(params.startTime, params.endTime);

  // 2. Calculate duration in minutes
  const durationMinutes = Math.ceil(
    (params.endTime.getTime() - params.startTime.getTime()) / (1000 * 60)
  );

  // 3. Create meeting params
  const meetingParams: CreateMeetingParams = {
    topic: params.topic,
    type: 2, // Scheduled meeting
    start_time: params.startTime.toISOString(),
    duration: durationMinutes,
    timezone: "Asia/Jakarta",
    settings: {
      host_video: true,
      participant_video: true,
      join_before_host: false,
      mute_upon_entry: true,
      watermark: false,
      use_pmi: false,
      approval_type: 0,
      registration_type: 0,
      audio: "both",
      auto_recording: params.autoRecording,
      enforce_login: false,
      show_share_button: false,
      allow_multiple_devices: true,
      waiting_room: params.enableWaitingRoom ? 1 : 0,
      meeting_authentication: false,
      capacity: params.capacity,
    },
  };

  // 4. Create meeting
  const meeting = await createMeeting(account.account_email, meetingParams);

  // 5. Increment account usage
  await incrementZoomAccountUsage(account.id);

  // 6. Extract hostkey from start_url (format: start_url contains host key)
  // Note: Zoom doesn't expose hostkey directly, it's in the start_url
  const hostkey = meeting.start_url.split('?')[1]?.split('=')[1] || '';

  return {
    zoomAccountId: account.id,
    zoomAccountIdStr: account.account_id,
    zoomMeetingId: meeting.id.toString(),
    joinUrl: meeting.join_url,
    startUrl: meeting.start_url,
    hostkey,
    passcode: meeting.password,
    meetingDetails: meeting,
  };
}

// ============================================================
// UTILITY FUNCTIONS
// ============================================================

/**
 * Format meeting details for display
 */
export function formatMeetingDetails(meeting: MeetingResponse): string {
  return `
Topic: ${meeting.topic}
Start: ${new Date(meeting.start_time).toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' })}
Duration: ${meeting.duration} minutes
Join URL: ${meeting.join_url}
Passcode: ${meeting.password}
  `.trim();
}

/**
 * Validate Zoom credentials are configured
 */
export function isZoomConfigured(): boolean {
  return !!(
    process.env.ZOOM_ACCOUNT_ID &&
    process.env.ZOOM_CLIENT_ID &&
    process.env.ZOOM_CLIENT_SECRET
  );
}
