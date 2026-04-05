import { useEffect, useState } from 'react';

interface Lead {
  id: string;
  name: string | null;
  email: string | null;
  status: string;
  createdAt: string;
}

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  const params = new URLSearchParams(window.location.search);
  const projectId = params.get('projectId');

  const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return token ? { 'Authorization': `Bearer ${token}` } : {};
  };

  const handleStatusUpdate = async (leadId: string) => {
    try {
      const response = await fetch(`/v1/chat/leads/${leadId}/status`, {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          ...getAuthHeader()
        },
        body: JSON.stringify({ status: 'contacted' }),
      });

      if (response.status === 401) {
        window.location.href = '/login' + window.location.search;
        return;
      }

      if (response.ok) {
        setLeads(prev =>
          prev
            .map(l => l.id === leadId ? { ...l, status: 'contacted' } : l)
            .filter(l => !statusFilter || l.status === statusFilter)
        );
        if (selectedLead && selectedLead.id === leadId) {
          setSelectedLead({ ...selectedLead, status: 'contacted' });
        }
      }
    } catch (err) {
      console.error('Failed to update status', err);
    }
  };

  const handleViewDetails = async (leadId: string) => {
    try {
      const response = await fetch(`/v1/chat/leads/${leadId}`, {
        headers: getAuthHeader()
      });
      
      if (response.status === 401) {
        window.location.href = '/login' + window.location.search;
        return;
      }

      if (response.ok) {
        const data = await response.json();
        setSelectedLead(data);
      }
    } catch (err) {
      console.error('Failed to fetch lead details', err);
    }
  };

  useEffect(() => {
    const url = statusFilter
      ? `/v1/chat/leads?projectId=${projectId}&status=${statusFilter}`
      : `/v1/chat/leads?projectId=${projectId}`;

    const fetchLeads = async () => {
      if (!projectId) {
        setError('Project ID is required');
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const response = await fetch(url, {
          headers: getAuthHeader()
        });

        if (response.status === 401) {
          window.location.href = '/login' + window.location.search;
          return;
        }

        if (!response.ok) {
          throw new Error('Failed to fetch leads');
        }
        const data = await response.json();
        setLeads(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchLeads();
  }, [projectId, statusFilter]);

  if (loading && leads.length === 0) return <div style={{ padding: '20px' }}>Loading leads...</div>;
  if (error) return <div style={{ padding: '20px', color: 'red' }}>Error: {error}</div>;

  const filterButtons = (
    <div style={{ marginBottom: '10px', display: 'flex', gap: '5px' }}>
      <button onClick={() => setStatusFilter(null)} style={{ fontWeight: statusFilter === null ? 'bold' : 'normal' }}>All</button>
      <button onClick={() => setStatusFilter('new')} style={{ fontWeight: statusFilter === 'new' ? 'bold' : 'normal' }}>New</button>
      <button onClick={() => setStatusFilter('submitted')} style={{ fontWeight: statusFilter === 'submitted' ? 'bold' : 'normal' }}>Submitted</button>
      <button onClick={() => setStatusFilter('contacted')} style={{ fontWeight: statusFilter === 'contacted' ? 'bold' : 'normal' }}>Contacted</button>
    </div>
  );

  if (leads.length === 0) return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1 style={{ fontSize: '24px', marginBottom: '20px' }}>Leads Dashboard</h1>
      <div style={{ marginBottom: '10px', color: '#666' }}>
        Project: {projectId}
      </div>
      {filterButtons}
      <div>No leads found.</div>
    </div>
  );

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1 style={{ fontSize: '24px', marginBottom: '20px' }}>Leads Dashboard</h1>
      <div style={{ marginBottom: '10px', color: '#666' }}>
        Project: {projectId}
      </div>
      {filterButtons}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {leads.map((lead) => (
          <div key={lead.id} style={{ border: '1px solid #ddd', padding: '15px', borderRadius: '8px' }}>
            <div style={{ fontWeight: 'bold' }}>ID: {lead.id}</div>
            <div>Name: {lead.name || '-'}</div>
            <div>Email: {lead.email || '-'}</div>
            <div>Status: <span style={{ fontWeight: 'bold', color: lead.status === 'new' ? 'blue' : 'green' }}>{lead.status}</span></div>
            <div style={{ fontSize: '12px', color: '#666' }}>Created: {new Date(lead.createdAt).toLocaleString()}</div>
            <div style={{ marginTop: '10px', display: 'flex', gap: '10px' }}>
              <button 
                onClick={() => handleViewDetails(lead.id)}
                style={{ cursor: 'pointer', padding: '5px 10px' }}
              >
                View details
              </button>
              {lead.status !== 'contacted' && (
                <button 
                  onClick={() => handleStatusUpdate(lead.id)}
                  style={{ cursor: 'pointer', padding: '5px 10px' }}
                >
                  Set as contacted
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {selectedLead && (
        <div style={{ marginTop: '30px', padding: '20px', border: '2px solid #333', borderRadius: '8px', backgroundColor: '#f9f9f9' }}>
          <h2 style={{ fontSize: '20px', marginBottom: '15px' }}>Lead Details</h2>
          <div><strong>ID:</strong> {selectedLead.id}</div>
          <div><strong>Name:</strong> {selectedLead.name || '-'}</div>
          <div><strong>Email:</strong> {selectedLead.email || '-'}</div>
          <div><strong>Status:</strong> {selectedLead.status}</div>
          <div><strong>Created At:</strong> {new Date(selectedLead.createdAt).toLocaleString()}</div>
          <button 
            onClick={() => setSelectedLead(null)}
            style={{ marginTop: '15px', cursor: 'pointer', padding: '5px 10px' }}
          >
            Close details
          </button>
        </div>
      )}
    </div>
  );
}
