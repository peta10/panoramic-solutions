'use client';

import { usePostHog } from '@/hooks/usePostHog';
import { Button } from '@/components/ui/button';

export const PostHogExample = () => {
  const { capture, trackClick, trackTool } = usePostHog();

  const handleExampleClick = () => {
    trackClick('example_button', { 
      location: 'demo_page',
      timestamp: Date.now()
    });
  };

  const handleCustomEvent = () => {
    capture('custom_demo_event', {
      event_type: 'demo',
      user_action: 'button_click',
      demo_data: 'example_value'
    });
  };

  const handleToolUsage = () => {
    trackTool('demo_tool', 'feature_used', {
      feature_name: 'example_feature',
      usage_count: 1
    });
  };

  return (
    <div className="p-6 space-y-4">
      <h3 className="text-lg font-semibold">PostHog Tracking Examples</h3>
      <div className="space-y-2">
        <Button onClick={handleExampleClick} variant="outline">
          Track Button Click
        </Button>
        <Button onClick={handleCustomEvent} variant="outline">
          Track Custom Event
        </Button>
        <Button onClick={handleToolUsage} variant="outline">
          Track Tool Usage
        </Button>
      </div>
    </div>
  );
};
