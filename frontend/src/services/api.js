const API_BASE = '/api';

export async function fetchApi(endpoint, options = {}) {
  const defaultHeaders = {
    'Content-Type': 'application/json',
  };
  
  // Inject mock token if present
  const token = localStorage.getItem('creovate_token');
  if (token) {
    defaultHeaders['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ detail: 'Network request failed' }));
    throw new Error(errorData.detail || `API error ${response.status}`);
  }

  return response.json();
}

// Creator Endpoints
export const apiGetCreators = (params = {}) => {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, val]) => {
    if (val !== undefined && val !== null && val !== '') {
      query.append(key, val);
    }
  });
  return fetchApi(`/creators?${query.toString()}`);
};

export const apiGetCreatorDetail = (id) => fetchApi(`/creators/${id}`);
export const apiUpdateCreatorProfile = (id, data) => fetchApi(`/creators/${id}`, { method: 'PUT', body: JSON.stringify(data) });
export const apiAddPortfolioItem = (creatorId, data) => fetchApi(`/creators/${creatorId}/portfolio`, { method: 'POST', body: JSON.stringify(data) });

// Brief Endpoints
export const apiGetBriefs = (params = {}) => {
  const query = new URLSearchParams(params);
  return fetchApi(`/briefs?${query.toString()}`);
};
export const apiGetBriefDetail = (id) => fetchApi(`/briefs/${id}`);
export const apiCreateBrief = (data) => fetchApi('/briefs', { method: 'POST', body: JSON.stringify(data) });
export const apiAssistBrief = (data) => fetchApi('/briefs/assist', { method: 'POST', body: JSON.stringify(data) });

// Proposal Endpoints
export const apiGetProposals = (params = {}) => {
  const query = new URLSearchParams(params);
  return fetchApi(`/proposals?${query.toString()}`);
};
export const apiSubmitProposal = (data) => fetchApi('/proposals', { method: 'POST', body: JSON.stringify(data) });
export const apiUpdateProposalStatus = (id, status) => fetchApi(`/proposals/${id}/status?status=${status}`, { method: 'PATCH' });

// Engagement & Deliverable Endpoints
export const apiGetEngagements = (params = {}) => {
  const query = new URLSearchParams(params);
  return fetchApi(`/engagements?${query.toString()}`);
};
export const apiGetDeliverables = (engagementId) => fetchApi(`/engagements/${engagementId}/deliverables`);
export const apiSubmitDeliverable = (engagementId, data) => fetchApi(`/engagements/${engagementId}/deliverables`, { method: 'POST', body: JSON.stringify(data) });
export const apiUpdateDeliverableStatus = (id, status, feedback = '') => fetchApi(`/deliverables/${id}/status?approval_status=${status}&feedback=${encodeURIComponent(feedback)}`, { method: 'PATCH' });
