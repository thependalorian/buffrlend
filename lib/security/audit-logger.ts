import { NextRequest, NextResponse } from 'next/server'

export interface AuditLogEntry {
  id: string
  timestamp: Date
  userId?: string
  action: string
  resource: string
  ipAddress: string
  userAgent: string
  method: string
  url: string
  statusCode?: number
  details?: Record<string, unknown>
  severity: 'low' | 'medium' | 'high' | 'critical'
}

class AuditLogger {
  private logs: AuditLogEntry[] = []

  public log(entry: Omit<AuditLogEntry, 'id' | 'timestamp'>): void {
    const logEntry: AuditLogEntry = {
      id: crypto.randomUUID(),
      timestamp: new Date(),
      ...entry,
    }

    this.logs.push(logEntry)
    
    // In production, you would send this to a logging service
    console.log('AUDIT LOG:', JSON.stringify(logEntry, null, 2))
  }

  public logAuthEvent(
    request: NextRequest,
    action: 'login' | 'logout' | 'login_failed' | 'password_reset',
    userId?: string,
    details?: Record<string, unknown>
  ): void {
    this.log({
      userId,
      action,
      resource: 'authentication',
      ipAddress: this.getClientIP(request),
      userAgent: request.headers.get('user-agent') || 'unknown',
      method: request.method,
      url: request.url,
      details,
      severity: action === 'login_failed' ? 'medium' : 'low',
    })
  }

  public logAPIAccess(
    request: NextRequest,
    userId?: string,
    statusCode?: number,
    details?: Record<string, unknown>
  ): void {
    this.log({
      userId,
      action: 'api_access',
      resource: 'api',
      ipAddress: this.getClientIP(request),
      userAgent: request.headers.get('user-agent') || 'unknown',
      method: request.method,
      url: request.url,
      statusCode,
      details,
      severity: 'low',
    })
  }

  public logSecurityEvent(
    request: NextRequest,
    action: string,
    severity: 'low' | 'medium' | 'high' | 'critical',
    details?: Record<string, unknown>
  ): void {
    this.log({
      action,
      resource: 'security',
      ipAddress: this.getClientIP(request),
      userAgent: request.headers.get('user-agent') || 'unknown',
      method: request.method,
      url: request.url,
      details,
      severity,
    })
  }

  public logDataAccess(
    request: NextRequest,
    action: 'create' | 'read' | 'update' | 'delete',
    resource: string,
    userId?: string,
    details?: Record<string, unknown>
  ): void {
    this.log({
      userId,
      action,
      resource,
      ipAddress: this.getClientIP(request),
      userAgent: request.headers.get('user-agent') || 'unknown',
      method: request.method,
      url: request.url,
      details,
      severity: action === 'delete' ? 'medium' : 'low',
    })
  }

  private getClientIP(request: NextRequest): string {
    const forwarded = request.headers.get('x-forwarded-for')
    const realIP = request.headers.get('x-real-ip')
    const cfConnectingIP = request.headers.get('cf-connecting-ip')
    
    return (
      cfConnectingIP ||
      realIP ||
      (forwarded ? forwarded.split(',')[0].trim() : '') ||
      'unknown'
    )
  }

  public getLogs(): AuditLogEntry[] {
    return [...this.logs]
  }

  public getLogsByUser(userId: string): AuditLogEntry[] {
    return this.logs.filter(log => log.userId === userId)
  }

  public getLogsBySeverity(severity: AuditLogEntry['severity']): AuditLogEntry[] {
    return this.logs.filter(log => log.severity === severity)
  }

  public clearLogs(): void {
    this.logs = []
  }
}

export const auditLogger = new AuditLogger()

export function withAuditLogging(
  handler: (request: NextRequest) => Promise<NextResponse>,
  options: {
    action: string
    resource: string
    severity?: AuditLogEntry['severity']
  }
) {
  return async (request: NextRequest): Promise<NextResponse> => {
    const startTime = Date.now()
    
    try {
      const response = await handler(request)
      const duration = Date.now() - startTime

      auditLogger.logAPIAccess(
        request,
        undefined, // userId would be extracted from auth
        response.status,
        {
          duration,
          action: options.action,
          resource: options.resource,
        }
      )

      return response
    } catch (error) {
      const duration = Date.now() - startTime

      auditLogger.logSecurityEvent(
        request,
        `${options.action}_error`,
        'high',
        {
          error: error instanceof Error ? error.message : 'Unknown error',
          duration,
          resource: options.resource,
        }
      )

      throw error
    }
  }
}
