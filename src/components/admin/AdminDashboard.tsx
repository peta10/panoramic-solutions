'use client';

import React, { useState, useEffect } from 'react';
import { AlertCircle, Plus } from 'lucide-react';
import { supabase } from '@/ppm-tool/shared/lib/supabase';
import { useAuth } from '@/ppm-tool/shared/hooks/useAuth';
import { AuthMenu } from '@/ppm-tool/components/auth/AuthMenu';

// Import types from PPM tool
import { Tool, Criterion } from '@/ppm-tool/shared/types';

// Import components from PPM tool
import { ToolsList } from '@/ppm-tool/features/admin/ToolsList';
import { EditToolForm } from '@/ppm-tool/features/admin/EditToolForm';
import { AdminToolForm } from '@/ppm-tool/features/admin/AdminToolForm';

export const AdminDashboard: React.FC = () => {
  const [tools, setTools] = useState<Tool[]>([]);
  const [selectedTool, setSelectedTool] = useState<Tool | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isAddingTool, setIsAddingTool] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [criteria, setCriteria] = useState<Criterion[]>([]);
  const { user, isAdmin, loading, signOut } = useAuth();
  
  useEffect(() => {
    if (user && supabase) {
      fetchTools();
      fetchCriteria();
    }
  }, [user]);

  const fetchTools = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Use admin_tools_view to get all tools regardless of status
      const { data, error } = await supabase
        .from('admin_tools_view')
        .select('*')
        .order('created_on', { ascending: false });
        
      if (error) throw error;
      
      if (data) {
        console.log('Fetched tools:', data);
        
        // Add updated_at field if it doesn't exist
        const toolsWithUpdated = data.map((tool: Tool) => ({
          ...tool,
          updated_at: tool.updated_at || tool.submitted_at || tool.approved_at || tool.created_on
        }));
        
        setTools(toolsWithUpdated as Tool[]);
      }
    } catch (err: unknown) {
      console.error('Error fetching tools:', err);
      setError(`Failed to load tools: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };
  
  const fetchCriteria = async () => {
    try {
      const { data, error } = await supabase
        .from('criteria')
        .select('*')
        .order('name');
        
      if (error) throw error;
      
      if (data) {
        // Transform database criteria to match Criterion type
        const formattedCriteria: Criterion[] = data.map(item => ({
          id: item.id,
          name: item.name,
          description: item.description || 'No description available',
          userRating: 3,
          ratingDescriptions: {
            low: 'Basic functionality',
            high: 'Advanced features'
          }
        }));
        
        setCriteria(formattedCriteria);
      }
    } catch (err: unknown) {
      console.error('Error fetching criteria:', err);
      setError(`Failed to load criteria: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };
  
  const handleEditTool = (tool: Tool) => {
    setSelectedTool(tool);
    setIsEditing(true);
    setIsAddingTool(false);
  };
  
  const handleAddNewTool = () => {
    setIsAddingTool(true);
    setIsEditing(false);
    setSelectedTool(null);
  };
  
  const handleDeleteTool = async (toolId: string) => {
    if (!confirm('Are you sure you want to delete this tool? This action cannot be undone.')) {
      return;
    }
    
    try {
      setError(null);
      const { error } = await supabase
        .from('tools')
        .delete()
        .eq('id', toolId);
        
      if (error) throw error;
      
      // Refresh the tools list
      fetchTools();
    } catch (err: unknown) {
      console.error('Error deleting tool:', err);
      setError(`Failed to delete tool: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };
  
  const handleApproveRejectTool = async (toolId: string, status: 'approved' | 'rejected') => {
    try {
      setError(null);
      
      // Use the update_tool_status RPC function instead of direct update
      const { error } = await supabase.rpc('update_tool_status', {
        p_tool_id: toolId,
        p_status: status
      });
      
      if (error) throw error;
      
      // Refresh the tools list
      fetchTools();
    } catch (err: unknown) {
      console.error(`Error ${status === 'approved' ? 'approving' : 'rejecting'} tool:`, err);
      setError(`Failed to ${status === 'approved' ? 'approve' : 'reject'} tool: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };
  
  const handleApproveAll = async () => {
    try {
      setError(null);
      
      const submittedTools = tools.filter(tool => tool.submission_status === 'submitted');
      
      if (submittedTools.length === 0) {
        return;
      }
      
      // Process each tool individually using the RPC function
      const promises = submittedTools.map(tool =>
        supabase.rpc('update_tool_status', {
          p_tool_id: tool.id,
          p_status: 'approved'
        })
      );
      
      const results = await Promise.all(promises);
      const errors = results.filter(result => result.error).map(result => result.error);
      
      if (errors.length > 0) {
        console.error('Errors approving tools:', errors);
        throw new Error(`Failed to approve ${errors.length} tools`);
      }
      
      // Refresh the tools list
      fetchTools();
    } catch (err: unknown) {
      console.error('Error approving all tools:', err);
      setError(`Failed to approve all tools: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };
  
  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-alpine mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Show login form if no user is authenticated
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
          <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">Panoramic Solutions Admin</h1>
          <p className="text-gray-600 mb-6 text-center">Please sign in to access the tool management dashboard.</p>
          <div className="flex justify-center">
            <AuthMenu user={user} onSignOut={signOut} />
          </div>
        </div>
      </div>
    );
  }

  // Show access denied if user is not admin
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="text-center max-w-md bg-white rounded-lg shadow-lg p-8">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600 mb-4">
            You are signed in as <strong>{user.email}</strong>, but you don't have admin permissions to access this dashboard.
          </p>
          <p className="text-sm text-gray-500 mb-6">
            Please contact your administrator to request access.
          </p>
          <div className="space-y-3">
            <AuthMenu user={user} onSignOut={signOut} />
            <button
              onClick={() => window.location.href = 'https://panoramic-solutions.com'}
              className="block w-full px-4 py-2 bg-alpine text-white rounded-lg hover:bg-summit transition-colors"
            >
              Back to Main Site
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-4 sticky top-0 z-40">
        <div className="container mx-auto">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <h1 className="text-xl md:text-2xl font-bold text-gray-900 truncate">
                Tool Management Dashboard
              </h1>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Add New Tool button */}
              <button 
                onClick={handleAddNewTool}
                className="flex items-center px-4 py-2 bg-alpine text-white rounded-lg hover:bg-summit transition-colors shadow-sm"
              >
                <Plus className="w-5 h-5 mr-2" />
                Add New Tool
              </button>
              
              {/* Auth Menu */}
              <AuthMenu user={user} onSignOut={signOut} />
            </div>
          </div>
        </div>
      </div>
      
      {/* Content */}
      <div className="container mx-auto px-4 py-6">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-start">
            <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
            <p className="text-sm">{error}</p>
          </div>
        )}
        
        {isAddingTool && (
          <AdminToolForm 
            onClose={() => setIsAddingTool(false)}
            onSuccess={() => {
              setIsAddingTool(false);
              fetchTools();
            }}
            selectedCriteria={criteria}
          />
        )}
        
        {isEditing && selectedTool ? (
          <EditToolForm 
            tool={selectedTool}
            onClose={() => {
              setIsEditing(false);
              setSelectedTool(null);
            }}
            onSuccess={() => {
              setIsEditing(false);
              setSelectedTool(null);
              fetchTools();
            }}
          />
        ) : (
          !isAddingTool && (
            <ToolsList 
              tools={tools} 
              isLoading={isLoading}
              onEdit={handleEditTool}
              onDelete={handleDeleteTool}
              onApproveReject={handleApproveRejectTool}
              onApproveAll={handleApproveAll}
            />
          )
        )}
      </div>
    </div>
  );
};
