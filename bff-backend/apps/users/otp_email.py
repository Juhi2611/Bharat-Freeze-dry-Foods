"""Branded HTML + plain-text templates for OTP verification emails."""

from __future__ import annotations

from django.conf import settings

# Optional public logo URL (e.g. CDN or production site). Falls back to inline SVG.
OTP_EMAIL_LOGO_URL = getattr(settings, 'OTP_EMAIL_LOGO_URL', '')


def _logo_block() -> str:
	if OTP_EMAIL_LOGO_URL:
		return (
			f'<img src="{OTP_EMAIL_LOGO_URL}" alt="Bharat Freeze Dry Foods" '
			'width="72" height="72" style="display:block;margin:0 auto 12px;border-radius:16px;" />'
		)
	# Inline SVG — works in Gmail/Apple Mail without external hosting.
	return """
<table role="presentation" cellpadding="0" cellspacing="0" align="center" style="margin:0 auto 16px;">
  <tr>
    <td align="center" style="width:72px;height:72px;border-radius:18px;background:linear-gradient(145deg,#1e3a5f 0%,#0f172a 100%);border:1px solid rgba(56,189,248,0.35);">
      <svg width="44" height="44" viewBox="0 0 44 44" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <path d="M6 32 L14 18 L22 26 L30 14 L38 32 Z" fill="none" stroke="#38bdf8" stroke-width="2" stroke-linejoin="round"/>
        <path d="M6 32 H38" stroke="#5fa755" stroke-width="2" stroke-linecap="round"/>
        <circle cx="34" cy="12" r="3" fill="#e1b84a"/>
      </svg>
    </td>
  </tr>
</table>
"""


def render_otp_email_html(*, code: str, ttl_minutes: int) -> str:
	site_name = getattr(settings, 'OTP_EMAIL_SITE_NAME', 'Bharat Freeze Dry Foods')
	support_email = getattr(settings, 'DEFAULT_FROM_EMAIL', 'export@bff-foods.com')
	frontend_url = getattr(settings, 'FRONTEND_URL', 'https://www.bharatfreezedried.com')

	return f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Your BFF verification code</title>
</head>
<body style="margin:0;padding:0;background-color:#070d18;font-family:Segoe UI,Roboto,Helvetica,Arial,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#070d18;padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;background:linear-gradient(180deg,#0f172a 0%,#111827 100%);border:1px solid rgba(56,189,248,0.2);border-radius:20px;overflow:hidden;box-shadow:0 24px 48px rgba(0,0,0,0.45);">
          <tr>
            <td style="padding:32px 28px 24px;text-align:center;background:linear-gradient(135deg,rgba(56,189,248,0.12) 0%,rgba(95,167,85,0.08) 100%);border-bottom:1px solid rgba(255,255,255,0.06);">
              {_logo_block()}
              <p style="margin:0;font-size:11px;font-weight:700;letter-spacing:0.28em;text-transform:uppercase;color:#38bdf8;">BFF · Export Operating System</p>
              <h1 style="margin:10px 0 0;font-size:22px;font-weight:700;line-height:1.3;color:#f8fafc;">{site_name}</h1>
              <p style="margin:8px 0 0;font-size:13px;line-height:1.5;color:#94a3b8;">Verify your email to access the B2B customer portal</p>
            </td>
          </tr>
          <tr>
            <td style="padding:28px;">
              <p style="margin:0 0 16px;font-size:15px;line-height:1.6;color:#cbd5e1;">
                Use the one-time verification code below to complete your account registration:
              </p>
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="padding:20px 16px;border-radius:16px;background:rgba(15,23,42,0.85);border:1px dashed rgba(56,189,248,0.45);">
                    <p style="margin:0 0 6px;font-size:11px;font-weight:600;letter-spacing:0.2em;text-transform:uppercase;color:#64748b;">Verification code</p>
                    <p style="margin:0;font-size:36px;font-weight:800;letter-spacing:0.35em;color:#38bdf8;font-family:Consolas,Monaco,monospace;">{code}</p>
                  </td>
                </tr>
              </table>
              <p style="margin:20px 0 0;font-size:13px;line-height:1.6;color:#94a3b8;">
                This code expires in <strong style="color:#e2e8f0;">{ttl_minutes} minutes</strong>.
                For your security, never share it with anyone — including BFF staff.
              </p>
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:24px;">
                <tr>
                  <td style="padding:14px 16px;border-radius:12px;background:rgba(95,167,85,0.12);border:1px solid rgba(95,167,85,0.25);">
                    <p style="margin:0;font-size:12px;line-height:1.5;color:#86efac;">
                      <strong>Didn't request this?</strong> You can safely ignore this email. Your account will not be created without the code.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding:20px 28px 28px;border-top:1px solid rgba(255,255,255,0.06);text-align:center;">
              <p style="margin:0 0 8px;font-size:12px;color:#64748b;">
                Export-grade freeze-dried foods · Made in Bharat for the world
              </p>
              <p style="margin:0;font-size:12px;color:#64748b;">
                <a href="{frontend_url}" style="color:#38bdf8;text-decoration:none;">Visit BFF</a>
                &nbsp;·&nbsp;
                <a href="mailto:{support_email}" style="color:#38bdf8;text-decoration:none;">{support_email}</a>
              </p>
            </td>
          </tr>
        </table>
        <p style="margin:16px 0 0;font-size:11px;color:#475569;">© {site_name}. All rights reserved.</p>
      </td>
    </tr>
  </table>
</body>
</html>"""


def render_otp_email_text(*, code: str, ttl_minutes: int) -> str:
	site_name = getattr(settings, 'OTP_EMAIL_SITE_NAME', 'Bharat Freeze Dry Foods')
	return (
		f'{site_name} — Email Verification\n'
		f'{"=" * 40}\n\n'
		f'Your verification code: {code}\n\n'
		f'This code expires in {ttl_minutes} minutes.\n'
		f'Enter it on the registration screen to verify your email.\n\n'
		f'If you did not request this code, you can ignore this email.\n'
		f'Never share this code with anyone.\n'
	)
