'use client';

import { RefreshCw, CheckCircle, XCircle, AlertCircle, Zap } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useNotionConnection, useNotionSync } from '@/lib/hooks/useNotion';
import useNotionStore from '@/lib/stores/notionStore';

export default function NotionConnectionStatus() {
  const { data: connectionStatus, isLoading, refetch } = useNotionConnection();
  const { syncData } = useNotionSync();
  const { connectionStatus: storeStatus } = useNotionStore();

  const handleRefresh = async () => {
    await refetch();
  };

  const handleSync = async () => {
    await syncData();
  };

  const getStatusIcon = () => {
    if (isLoading || storeStatus.syncStatus === 'syncing') {
      return <RefreshCw className="h-4 w-4 animate-spin text-blue-600" />;
    }

    if (connectionStatus?.isConnected) {
      return <CheckCircle className="h-4 w-4 text-green-600" />;
    }

    if (storeStatus.syncStatus === 'error') {
      return <XCircle className="h-4 w-4 text-red-600" />;
    }

    return <AlertCircle className="h-4 w-4 text-amber-600" />;
  };

  const getStatusText = () => {
    if (isLoading) return 'Checking connection...';
    if (storeStatus.syncStatus === 'syncing') return 'Syncing data...';
    if (connectionStatus?.isConnected) return 'Connected to Notion';
    if (storeStatus.syncStatus === 'error') return 'Connection error';
    return 'Not connected';
  };

  const getStatusColor = () => {
    if (isLoading || storeStatus.syncStatus === 'syncing') return 'text-blue-600';
    if (connectionStatus?.isConnected) return 'text-green-600';
    if (storeStatus.syncStatus === 'error') return 'text-red-600';
    return 'text-amber-600';
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <Zap className="h-4 w-4" />
          Notion Integration
        </CardTitle>
        {getStatusIcon()}
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <p className={`text-sm font-medium ${getStatusColor()}`}>
            {getStatusText()}
          </p>
          
          {connectionStatus?.workspaceName && (
            <p className="text-xs text-muted-foreground">
              Workspace: {connectionStatus.workspaceName}
            </p>
          )}

          {connectionStatus?.lastSync && (
            <p className="text-xs text-muted-foreground">
              Last sync: {new Date(connectionStatus.lastSync).toLocaleString()}
            </p>
          )}

          {storeStatus.errorMessage && (
            <p className="text-xs text-red-600">
              {storeStatus.errorMessage}
            </p>
          )}

          <div className="flex gap-2 mt-3">
            <button
              onClick={handleRefresh}
              disabled={isLoading}
              className="flex items-center gap-1 px-2 py-1 text-xs bg-secondary hover:bg-secondary/80 rounded-md transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`h-3 w-3 ${isLoading ? 'animate-spin' : ''}`} />
              Test Connection
            </button>

            {connectionStatus?.isConnected && (
              <button
                onClick={handleSync}
                disabled={storeStatus.syncStatus === 'syncing'}
                className="flex items-center gap-1 px-2 py-1 text-xs bg-primary text-primary-foreground hover:bg-primary/90 rounded-md transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`h-3 w-3 ${storeStatus.syncStatus === 'syncing' ? 'animate-spin' : ''}`} />
                Sync Data
              </button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}