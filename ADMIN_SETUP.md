# Admin System Setup

## Overview
The admin system has been successfully set up for the Panoramic Solutions website. It allows authorized users to manage PPM tools through a web interface that's completely separate from the embedded PPM tool.

## Routes Created

### Main Website Admin Route
- **URL**: `/admin`
- **Location**: `src/app/admin/page.tsx`
- **Purpose**: Provides access to the admin dashboard from the main website

## Components Created

### Authentication Components
- **AuthMenu**: `src/components/auth/AuthMenu.tsx`
  - Provides sign in/sign up functionality
  - Displays user email when logged in
  - Sign out functionality

### Admin Dashboard
- **AdminDashboard**: `src/components/admin/AdminDashboard.tsx`
  - Main admin interface
  - Reuses existing PPM tool admin components
  - Handles authentication and authorization

### Hooks
- **useAuth**: `src/shared/hooks/useAuth.ts`
  - Manages user authentication state
  - Checks admin permissions via `admin_users` table
  - Provides sign out functionality

- **useClickOutside**: `src/shared/hooks/useClickOutside.ts`
  - Utility hook for closing dropdowns when clicking outside

## Navigation Updates

### Header Component
- **Location**: `src/components/layout/Header.tsx`
- **Changes**:
  - Added auth menu to both desktop and mobile navigation
  - Added admin link (only visible to admin users)
  - Integrated authentication state management

## How It Works

1. **Authentication**: Users can sign in through the AuthMenu component in the header
2. **Authorization**: The system checks if the user is in the `admin_users` table
3. **Admin Access**: Only users with admin privileges see the "Admin" link in navigation
4. **Tool Management**: Admin users can:
   - View all tools (regardless of status)
   - Edit existing tools
   - Add new tools
   - Approve/reject submitted tools
   - Delete tools

## Access Control

- **Public Users**: See normal website with sign in option
- **Authenticated Users**: See sign out option, no admin access unless granted
- **Admin Users**: See admin link in navigation, full access to admin dashboard

## Database Requirements

The system expects the following database tables to exist:
- `admin_users` - Contains admin user permissions
- `tools` - PPM tools data
- `criteria` - Rating criteria
- `admin_tools_view` - View for admin tool management

## Security Features

- Authentication required for admin access
- Role-based access control via `admin_users` table
- Session management through Supabase Auth
- Separate admin interface from public tools

## Usage

1. Navigate to the main website
2. Sign in using the auth menu in the header
3. If you're an admin user, you'll see an "Admin" link
4. Click "Admin" to access the tool management dashboard
5. Manage tools using the intuitive interface

The admin system is now fully functional and integrated into the main website!
