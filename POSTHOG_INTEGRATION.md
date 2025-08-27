# PostHog Integration Documentation

## Overview

PostHog has been integrated into the Panoramic Solutions website to track user behavior, form submissions, and tool usage. The integration is set up to automatically capture page views and provide easy-to-use utilities for custom event tracking.

## Configuration

### Environment Variables

The following environment variables are required:

```env
NEXT_PUBLIC_POSTHOG_KEY=phc_nwcxiZSuJPPfAaRE6Scqs8boALWrRmNDZhG5dYGuzZi
NEXT_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com
```

### Initialization

PostHog is initialized in `src/instrumentation-client.ts` alongside Sentry. The configuration includes:

- Automatic pageview capture
- Automatic session recording
- Debug mode in development
- API host configuration

## Core Metrics Tracking

The integration automatically tracks four core metrics:

### 1. New_Visitor
- **When**: First time a user visits the site
- **Properties**: Page, tool type, user agent, referrer
- **Storage**: Uses localStorage to ensure one-time tracking per user

### 2. New_Active
- **When**: User makes their first interaction (click, scroll, etc.)
- **Properties**: Action type, page, interaction type
- **Storage**: Uses localStorage to ensure one-time tracking per user

### 3. New_Ranking_Submittal
- **When**: User completes guided ranking or submits contact form
- **Properties**: Ranking type, questions answered, criteria count
- **Tracking**: Manual tracking in guided ranking form and contact form

### 4. New_Report_Sent
- **When**: User successfully sends an email report
- **Properties**: Tool count, criteria count, email domain, chart usage
- **Tracking**: Automatic tracking in email report hook

## Usage

### 1. Using the PostHog Hook

The easiest way to use PostHog in components is through the `usePostHog` hook:

```tsx
import { usePostHog } from '@/hooks/usePostHog';

export const MyComponent = () => {
  const { 
    capture, 
    trackClick, 
    trackForm, 
    trackTool,
    trackVisitor,
    trackActive,
    trackRanking,
    trackReport,
    checkAndTrackVisitor,
    checkAndTrackActive
  } = usePostHog();

  // Manual tracking
  const handleButtonClick = () => {
    trackClick('my_button', { location: 'homepage' });
  };

  // Automatic visitor tracking
  useEffect(() => {
    checkAndTrackVisitor({ page: 'homepage' });
  }, []);

  // Automatic active user tracking
  useEffect(() => {
    const handleFirstInteraction = () => {
      checkAndTrackActive('button_click', { page: 'homepage' });
      document.removeEventListener('click', handleFirstInteraction);
    };
    document.addEventListener('click', handleFirstInteraction);
  }, []);

  return (
    <button onClick={handleButtonClick}>
      Click Me
    </button>
  );
};
```

### 2. Direct PostHog Usage

You can also use PostHog directly through the utility functions:

```tsx
import { 
  captureEvent, 
  trackButtonClick,
  trackNewVisitor,
  trackNewActive,
  trackNewRankingSubmittal,
  trackNewReportSent
} from '@/lib/posthog';

// Track a custom event
captureEvent('user_action', { action_type: 'button_click' });

// Track core metrics
trackNewVisitor({ page: 'contact' });
trackNewActive('form_submission', { form_type: 'contact' });
trackNewRankingSubmittal({ ranking_type: 'guided' });
trackNewReportSent({ tool_count: 3, criteria_count: 5 });
```

### 3. Available Tracking Functions

#### From usePostHog Hook:
- `capture(eventName, properties)` - Track custom events
- `trackClick(buttonName, properties)` - Track button clicks
- `trackForm(formName, properties)` - Track form submissions
- `trackTool(toolName, action, properties)` - Track tool usage
- `identify(userId, properties)` - Identify users
- `setUserProperties(properties)` - Set user properties
- `getUserId()` - Get current user ID
- `isIdentified()` - Check if user is identified

#### Core Metrics Functions:
- `trackVisitor(properties)` - Track new visitor
- `trackActive(action, properties)` - Track new active user
- `trackRanking(properties)` - Track ranking submittal
- `trackReport(properties)` - Track report sent
- `checkAndTrackVisitor(properties)` - Auto-track new visitor (one-time)
- `checkAndTrackActive(action, properties)` - Auto-track new active user (one-time)
- `getSession()` - Get current session ID
- `resetState()` - Reset tracking state

#### From lib/posthog:
- `captureEvent(eventName, properties)`
- `trackButtonClick(buttonName, properties)`
- `trackFormSubmission(formName, properties)`
- `trackToolUsage(toolName, action, properties)`
- `identifyUser(userId, properties)`
- `setUserProperties(properties)`
- `trackPageView(pageName)`
- `trackCustomPageView(pageName, properties)`

## Event Examples

### Contact Form Tracking

```tsx
// Form submission attempt
trackForm('contact_form', {
  has_name: true,
  has_email: true,
  has_company: true,
  has_message: true,
  message_length: 150
});

// Successful submission
capture('contact_form_submitted', {
  company: 'Acme Corp',
  message_length: 150,
  submission_time: Date.now()
});

// Form validation error
capture('contact_form_validation_error', {
  missing_fields: ['email', 'company']
});

// Track ranking submittal
trackRanking({
  form_type: 'contact_inquiry',
  company: 'Acme Corp'
});
```

### PPM Tool Tracking

```tsx
// Tool usage
trackTool('ppm_tool', 'started_guided_flow', {
  source: 'how_it_works'
});

// Button clicks
trackClick('get_started_button', {
  location: 'how_it_works_overlay'
});

// Tool completion
trackTool('ppm_tool', 'guided_ranking_completed', {
  source: 'guided_flow',
  completion_time: Date.now()
});

// Track ranking submittal
trackRanking({
  ranking_type: 'guided',
  questions_answered: 5,
  criteria_count: 8
});
```

### Email Report Tracking

```tsx
// Track report sent
trackReport({
  tool_count: 3,
  criteria_count: 5,
  has_chart: true,
  email_domain: 'company.com'
});
```

### Page View Tracking

```tsx
// Custom page view
trackCustomPageView('contact_page', {
  referrer: 'homepage',
  user_type: 'prospect'
});
```

## Best Practices

### 1. Event Naming
- Use snake_case for event names
- Be descriptive and consistent
- Include the action being performed

### 2. Properties
- Include relevant context
- Use consistent property names
- Avoid sensitive information
- Include timestamps when relevant

### 3. User Identification
- Identify users when they provide contact information
- Set user properties for segmentation
- Use consistent user IDs across sessions

### 4. Error Tracking
- Track form validation errors
- Track API errors
- Include error context for debugging

### 5. Core Metrics
- Use automatic tracking functions when possible
- Ensure one-time tracking with localStorage
- Include relevant context in properties

## Testing

### Development Mode
PostHog debug mode is enabled in development. You can see events in:
1. Browser console
2. PostHog dashboard
3. Network tab (PostHog API calls)

### Production
Events are automatically sent to PostHog in production. Monitor the PostHog dashboard for:
- Event volume
- User engagement
- Conversion funnels
- Error rates

## Monitoring

### Key Metrics to Track
- Contact form submissions
- PPM tool usage
- Page engagement
- User journey completion
- Error rates
- Core metrics (New_Visitor, New_Active, New_Ranking_Submittal, New_Report_Sent)

### Dashboards
Create PostHog dashboards for:
- User acquisition
- Tool engagement
- Contact form conversion
- Error monitoring
- Core metrics funnel

## Troubleshooting

### Common Issues

1. **Events not appearing in PostHog**
   - Check environment variables
   - Verify PostHog initialization
   - Check browser console for errors

2. **Duplicate events**
   - Ensure events are not fired multiple times
   - Use proper event deduplication
   - Use automatic tracking functions for core metrics

3. **Missing user identification**
   - Call `identify()` when user provides information
   - Set user properties for better segmentation

4. **Core metrics not tracking**
   - Check localStorage for tracking state
   - Use `resetState()` to clear tracking state for testing
   - Verify automatic tracking functions are called

### Debug Mode
Enable debug mode in development to see events in the console:

```tsx
// Already configured in instrumentation-client.ts
if (process.env.NODE_ENV === 'development') {
  posthog.debug();
}
```

## Security Considerations

- Never track sensitive information (passwords, SSNs, etc.)
- Use environment variables for configuration
- Respect user privacy preferences
- Follow GDPR compliance guidelines
- Implement proper data retention policies

## Future Enhancements

- A/B testing integration
- Feature flags
- User surveys
- Advanced funnel analysis
- Custom dashboards
- Export capabilities
