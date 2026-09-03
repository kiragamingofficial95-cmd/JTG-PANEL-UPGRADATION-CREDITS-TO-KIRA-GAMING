import React, { useState, useEffect } from 'react';
import { Plus, Minus, RotateCcw, Activity } from 'lucide-react';

export default function DemoCounterWidget() {
  const [counter, setCounter] = useState(0);
  const [config, setConfig] = useState({});
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('counter');

  useEffect(() => {
    fetchState();
    const interval = setInterval(fetchState, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchState = async () => {
    try {
      const res = await fetch('/api/extensions/demo-counter/state');
      const data = await res.json();
      if (data.success) {
        setCounter(data.value);
        setConfig(data.config);
      }
      
      const logRes = await fetch('/api/extensions/demo-counter/log');
      const logData = await logRes.json();
      if (logData.success) {
        setLogs(logData.logs);
      }
    } catch (error) {
      console.error('Failed to fetch state:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleIncrement = async () => {
    try {
      await fetch('/api/extensions/demo-counter/increment', { method: 'POST' });
      fetchState();
    } catch (error) {
      console.error('Increment failed:', error);
    }
  };

  const handleDecrement = async () => {
    try {
      await fetch('/api/extensions/demo-counter/decrement', { method: 'POST' });
      fetchState();
    } catch (error) {
      console.error('Decrement failed:', error);
    }
  };

  const handleReset = async () => {
    try {
      await fetch('/api/extensions/demo-counter/reset', { method: 'POST' });
      fetchState();
    } catch (error) {
      console.error('Reset failed:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const maxValue = config.maxValue || 1000;
  const progressPercent = (counter / maxValue) * 100;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white">
        <h2 className="text-2xl font-bold mb-2">Demo Counter Extension</h2>
        <p className="text-blue-100">Test the Blueprint serverless key function</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('counter')}
          className={`px-4 py-2 font-medium transition ${
            activeTab === 'counter'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Counter
        </button>
        <button
          onClick={() => setActiveTab('logs')}
          className={`px-4 py-2 font-medium transition ${
            activeTab === 'logs'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Activity Log
        </button>
      </div>

      {/* Counter Tab */}
      {activeTab === 'counter' && (
        <div className="space-y-6">
          {/* Counter Display */}
          <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
            <div className="text-6xl font-bold text-blue-600 mb-4">{counter}</div>
            <div className="text-gray-600 mb-6">
              {counter} / {maxValue} (Progress: {Math.round(progressPercent)}%)
            </div>
            
            {/* Progress Bar */}
            <div className="w-full bg-gray-200 rounded-full h-3 mb-6 overflow-hidden">
              <div
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>

            {/* Controls */}
            <div className="flex gap-3 justify-center flex-wrap">
              <button
                onClick={handleDecrement}
                disabled={counter === 0}
                className="flex items-center gap-2 px-6 py-3 bg-red-500 hover:bg-red-600 disabled:bg-gray-300 text-white rounded-lg font-medium transition"
              >
                <Minus size={20} /> Decrement
              </button>
              
              <button
                onClick={handleReset}
                className="flex items-center gap-2 px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-medium transition"
              >
                <RotateCcw size={20} /> Reset
              </button>
              
              <button
                onClick={handleIncrement}
                disabled={counter >= maxValue}
                className="flex items-center gap-2 px-6 py-3 bg-green-500 hover:bg-green-600 disabled:bg-gray-300 text-white rounded-lg font-medium transition"
              >
                <Plus size={20} /> Increment
              </button>
            </div>
          </div>

          {/* Configuration Info */}
          <div className="bg-gray-50 rounded-lg border border-gray-200 p-4">
            <h3 className="font-semibold text-gray-900 mb-3">Configuration</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Start Value</p>
                <p className="text-lg font-semibold text-gray-900">{config.startValue || 0}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Increment Step</p>
                <p className="text-lg font-semibold text-gray-900">{config.incrementStep || 1}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Max Value</p>
                <p className="text-lg font-semibold text-gray-900">{config.maxValue || 1000}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Logging</p>
                <p className="text-lg font-semibold text-gray-900">
                  {config.enableLogging !== false ? 'Enabled' : 'Disabled'}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Logs Tab */}
      {activeTab === 'logs' && (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex items-center gap-2">
            <Activity size={20} className="text-blue-600" />
            <h3 className="font-semibold text-gray-900">Recent Activity</h3>
            <span className="ml-auto text-sm text-gray-600">{logs.length} entries</span>
          </div>
          
          {logs.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              No activity recorded yet
            </div>
          ) : (
            <div className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
              {logs.map((log, idx) => (
                <div key={idx} className="px-6 py-4 hover:bg-gray-50 transition">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold text-gray-900">
                        {log.action.charAt(0).toUpperCase() + log.action.slice(1)}
                      </p>
                      <p className="text-sm text-gray-600">
                        Value: {log.value}
                      </p>
                    </div>
                    <p className="text-xs text-gray-500">
                      {new Date(log.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
