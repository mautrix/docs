# Captcha Challenge
Signal may ratelimit you, in particular when sending messages to contacts previously unknown to the bridge or the primary device. If you have been ratelimited, you can wait some time (typically a day) or complete a captcha.

## sending a captcha challenge via the bridge
1. go to <https://signalcaptchas.org/challenge/generate> to generate a captcha code
   * The page will redirect you to a `signalcaptcha://` URI after solving the
     captcha. At least on Firefox, you need to have the devtools console open
     to be able to see and copy the URI.
   * Alternatively, you can wait for a few seconds for the "Open Signal" button
     to appear, then right click on it and copy the link.
2. Send `submit-challenge <captcha code>` to the bridge bot
