/**
 * Kullanıcı yolculuğu event tipleri
 */
export enum EventType {
  // Arama & Başlangıç
  TRIP_SEARCH_STARTED = 'trip_search_started',
  TRIP_SEARCH_COMPLETED = 'trip_search_completed',
  TRIP_SEARCH_FAILED = 'trip_search_failed',
  
  // Uçuş işlemleri
  FLIGHT_RESULTS_RECEIVED = 'flight_results_received',
  FLIGHT_SELECTED = 'flight_selected',
  FLIGHT_DETAIL_OPENED = 'flight_detail_opened',
  
  // Otel işlemleri
  ACCOMMODATION_RESULTS_RECEIVED = 'accommodation_results_received',
  HOTEL_SELECTED = 'hotel_selected',
  HOTEL_DETAIL_OPENED = 'hotel_detail_opened',
  
  // Aktivite & Cazibe merkezleri
  ACTIVITIES_RESULTS_RECEIVED = 'activities_results_received',
  ACTIVITY_SELECTED = 'activity_selected',
  ATTRACTION_SELECTED = 'attraction_selected',
  
  // İterasyon & Planlama
  ITINERARY_GENERATED = 'itinerary_generated',
  ITINERARY_MODIFIED = 'itinerary_modified',
  
  // UI İşlemleri
  MAP_OPENED = 'map_opened',
  RESERVATION_SCREEN_OPENED = 'reservation_screen_opened',
  
  // MCP İşlemleri
  MCP_REQUEST_SENT = 'mcp_request_sent',
  MCP_RESPONSE_RECEIVED = 'mcp_response_received',
  MCP_ERROR = 'mcp_error',
  
  // Eksik bilgi
  MISSING_INFO_REQUESTED = 'missing_info_requested',
}

/**
 * Log seviyeleri
 */
export enum LogLevel {
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error',
}

/**
 * Standart event log formatı
 */
export interface EventLog {
  timestamp: string;
  level: LogLevel;
  event: EventType;
  sessionId: string;
  details: Record<string, any>;
  responseTime?: number;
  userId?: string;
  ip?: string;
}

