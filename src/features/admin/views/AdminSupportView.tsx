import React, { useEffect, useMemo, useState } from 'react';
import { useAdminStore } from '../../../store/useAdminStore';
import { DisputeItem, DisputeStatus, SupportMessage, SupportMessageType, SupportTicket, SupportWorkflowStage } from '../../../constants/mockData';
import {
  AlertTriangle,
  ArrowRight,
  Check,
  CheckCircle2,
  FileText,
  GitBranch,
  LifeBuoy,
  MessageSquare,
  Paperclip,
  Search,
  ShieldAlert,
  UserRound,
  X,
} from 'lucide-react';

type SupportTab = 'OVERVIEW' | 'TICKETS' | 'DISPUTES';

const stageLabel: Record<SupportWorkflowStage, string> = {
  TICKET_RAISED: 'Ticket raised',
  SUPPORT_INVESTIGATION: 'Support investigation',
  ESCALATED: 'Escalated to dispute',
  DISPUTE_INVESTIGATION: 'Dispute investigation',
  RESOLUTION: 'Resolution in progress',
  RESOLVED: 'Resolved',
  CLOSED: 'Closed',
};

const seriousIssue = (ticket: SupportTicket) => ticket.severity === 'SERIOUS' || (!ticket.severity && ticket.priority === 'HIGH');

const stageFor = (ticket: SupportTicket): SupportWorkflowStage => {
  if (ticket.workflowStage) return ticket.workflowStage;
  if (ticket.status === 'CLOSED') return 'CLOSED';
  if (ticket.status === 'RESOLVED') return seriousIssue(ticket) ? 'RESOLUTION' : 'RESOLVED';
  if (ticket.status === 'ESCALATED') return 'ESCALATED';
  if (ticket.status === 'IN_PROGRESS' || ticket.status === 'WAITING_FOR_CUSTOMER') return seriousIssue(ticket) ? 'DISPUTE_INVESTIGATION' : 'SUPPORT_INVESTIGATION';
  return 'TICKET_RAISED';
};

const nextStageFor = (ticket: SupportTicket): SupportWorkflowStage | null => {
  const stage = stageFor(ticket);
  if (stage === 'TICKET_RAISED') return seriousIssue(ticket) ? 'ESCALATED' : 'SUPPORT_INVESTIGATION';
  if (stage === 'ESCALATED') return 'DISPUTE_INVESTIGATION';
  if (stage === 'SUPPORT_INVESTIGATION') return 'RESOLVED';
  if (stage === 'DISPUTE_INVESTIGATION') return 'RESOLUTION';
  if (stage === 'RESOLUTION' || stage === 'RESOLVED') return 'CLOSED';
  return null;
};

const workflowPath = (ticket: SupportTicket): SupportWorkflowStage[] => seriousIssue(ticket)
  ? ['TICKET_RAISED', 'ESCALATED', 'DISPUTE_INVESTIGATION', 'RESOLUTION', 'CLOSED']
  : ['TICKET_RAISED', 'SUPPORT_INVESTIGATION', 'RESOLVED', 'CLOSED'];

const messageColor = (type: SupportMessageType, dark: boolean) => type === 'INTERNAL' ? (dark ? '#FBBF24' : '#B45309') : type === 'SYSTEM' ? '#60A5FA' : '#34D399';

const toMessages = (ticket: SupportTicket): SupportMessage[] => ticket.messages || (ticket.conversation || []).map((message, index) => ({
  id: `${ticket.id}-legacy-${index}`,
  sender: message.sender,
  role: message.role,
  type: 'PUBLIC' as const,
  message: message.message,
  timestamp: message.timestamp,
}));

const statusLabel = (status: SupportTicket['status']) => status.replace(/_/g, ' ');

export const AdminSupportView: React.FC = () => {
  const {
    supportTickets,
    disputes,
    updateTicketWorkflow,
    updateTicketPriority,
    updateTicketStatus,
    updateTicketAssignment,
    addTicketMessage,
    addTicketInternalNote,
    createDisputeFromTicket,
    updateDisputeStatus,
    addDisputeEvidence,
    requestDisputeInformation,
    resolveDispute,
    closeDispute,
    theme = 'dark',
  } = useAdminStore();
  const [tab, setTab] = useState<SupportTab>('OVERVIEW');
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  const [selectedDisputeId, setSelectedDisputeId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [ticketStatus, setTicketStatus] = useState<'ALL' | SupportTicket['status']>('ALL');
  const [ticketType, setTicketType] = useState<'ALL' | 'BUYER' | 'SELLER'>('ALL');
  const [messageMode, setMessageMode] = useState<'PUBLIC' | 'INTERNAL'>('PUBLIC');
  const [draft, setDraft] = useState('');
  const [noteDraft, setNoteDraft] = useState('');
  const [showEscalation, setShowEscalation] = useState(false);
  const [escalation, setEscalation] = useState({ reason: '', category: 'ORDER DISPUTE', disputedAmount: '0', assignedTo: 'Rajesh Sharma' });
  const [evidenceName, setEvidenceName] = useState('');
  const [evidenceDescription, setEvidenceDescription] = useState('');
  const [resolutionType, setResolutionType] = useState<NonNullable<DisputeItem['resolution']>['type']>('CUSTOM_RESOLUTION');
  const [resolutionNote, setResolutionNote] = useState('');
  const dark = theme === 'dark';
  const c = {
    text: dark ? '#F8FAFC' : '#0F172A',
    muted: dark ? '#94A3B8' : '#64748B',
    panel: dark ? 'rgba(15,23,42,.82)' : '#FFF',
    soft: dark ? 'rgba(30,41,59,.72)' : '#F8FAFC',
    border: dark ? 'rgba(148,163,184,.16)' : '#E2E8F0',
    input: dark ? 'rgba(15,23,42,.66)' : '#FFF',
  };

  const selectedTicket = selectedTicketId ? supportTickets.find((ticket) => ticket.id === selectedTicketId) || null : null;
  const selectedDispute = selectedDisputeId ? disputes.find((dispute) => dispute.id === selectedDisputeId) || null : null;

  const filteredTickets = useMemo(() => supportTickets.filter((ticket) => {
    const query = search.toLowerCase();
    const matchesSearch = !query || [ticket.ticketNumber, ticket.subject, ticket.raisedBy, ticket.category, ticket.assignedTo].some((value) => value.toLowerCase().includes(query));
    const matchesStatus = ticketStatus === 'ALL' || ticket.status === ticketStatus;
    const matchesType = ticketType === 'ALL' || ticket.userType === ticketType;
    return matchesSearch && matchesStatus && matchesType;
  }), [supportTickets, search, ticketStatus, ticketType]);

  const openTickets = supportTickets.filter((ticket) => !['RESOLVED', 'CLOSED'].includes(stageFor(ticket))).length;
  const inProgress = supportTickets.filter((ticket) => ['IN_PROGRESS', 'ESCALATED', 'WAITING_FOR_CUSTOMER'].includes(ticket.status)).length;
  const escalated = supportTickets.filter((ticket) => stageFor(ticket) === 'ESCALATED' || Boolean(ticket.disputeId)).length;
  const resolved = supportTickets.filter((ticket) => ['RESOLVED', 'CLOSED'].includes(ticket.status)).length;

  useEffect(() => {
    if (selectedTicketId && !supportTickets.some((ticket) => ticket.id === selectedTicketId)) setSelectedTicketId(null);
    if (selectedDisputeId && !disputes.some((dispute) => dispute.id === selectedDisputeId)) setSelectedDisputeId(null);
  }, [supportTickets, disputes, selectedTicketId, selectedDisputeId]);

  const buttonStyle: React.CSSProperties = { border: `1px solid ${c.border}`, borderRadius: 9, padding: '9px 12px', background: c.soft, color: c.text, fontSize: 11, fontWeight: 800, cursor: 'pointer' };
  const selectStyle: React.CSSProperties = { ...buttonStyle, appearance: 'auto', minWidth: 0, outline: 'none' };

  const advanceTicket = (ticket: SupportTicket) => {
    const next = nextStageFor(ticket);
    if (next) updateTicketWorkflow(ticket.id, next);
  };

  const submitMessage = () => {
    if (!selectedTicket || !draft.trim()) return;
    addTicketMessage(selectedTicket.id, messageMode, draft.trim());
    setDraft('');
  };

  const submitNote = () => {
    if (!selectedTicket || !noteDraft.trim()) return;
    addTicketInternalNote(selectedTicket.id, noteDraft.trim());
    setNoteDraft('');
  };

  const submitEscalation = () => {
    if (!selectedTicket || !escalation.reason.trim()) return;
    createDisputeFromTicket(selectedTicket.id, { ...escalation, disputedAmount: Number(escalation.disputedAmount) || 0 });
    setShowEscalation(false);
    setTab('DISPUTES');
  };

  const addEvidence = () => {
    if (!selectedDispute || !evidenceName.trim()) return;
    addDisputeEvidence(selectedDispute.id, { fileName: evidenceName.trim(), fileType: 'DOCUMENT', uploadedBy: 'Administrator', role: 'ADMIN', description: evidenceDescription.trim() || 'Evidence added during admin review.' });
    setEvidenceName('');
    setEvidenceDescription('');
  };

  const submitResolution = () => {
    if (!selectedDispute || !resolutionNote.trim()) return;
    resolveDispute(selectedDispute.id, { type: resolutionType, note: resolutionNote.trim(), resolvedAt: 'Just now' });
    setResolutionNote('');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 22, maxWidth: 1480, margin: '0 auto' }}>
      <style>{`.support-card,.support-row,.dispute-card{transition:transform .18s ease,box-shadow .18s ease,border-color .18s ease}.support-card:hover,.dispute-card:hover{transform:translateY(-3px);box-shadow:0 16px 35px rgba(2,6,23,.16)!important;border-color:rgba(96,165,250,.55)!important}.support-row:hover{background:rgba(96,165,250,.08)!important}.conversation-row{transition:background .18s ease}.conversation-row:hover{background:rgba(96,165,250,.08)!important}`}</style>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 18, flexWrap: 'wrap' }}>
        <div>
          <div style={{ color: '#F87171', fontSize: 11, fontWeight: 800, letterSpacing: '.1em', textTransform: 'uppercase' }}>Operations / service recovery</div>
          <h1 style={{ color: c.text, fontSize: 'clamp(22px,2.4vw,30px)', margin: '8px 0 0' }}>Customer support & dispute mediation</h1>
          <p style={{ color: c.muted, fontSize: 13, margin: '8px 0 0' }}>Route every case from ticket intake to investigation, resolution, and closure.</p>
        </div>
        <div style={{ display: 'flex', gap: 5, padding: 4, background: c.soft, border: `1px solid ${c.border}`, borderRadius: 11 }}>
          {(['OVERVIEW', 'TICKETS', 'DISPUTES'] as SupportTab[]).map((item) => <button key={item} onClick={() => setTab(item)} style={{ border: 0, borderRadius: 8, padding: '9px 13px', background: tab === item ? '#2563EB' : 'transparent', color: tab === item ? '#FFF' : c.muted, fontSize: 10, fontWeight: 800, cursor: 'pointer' }}>{item}<span style={{ marginLeft: 5, opacity: .8 }}>{item === 'TICKETS' ? supportTickets.length : item === 'DISPUTES' ? disputes.length : ''}</span></button>)}
        </div>
      </header>

      {tab === 'OVERVIEW' && <>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(150px,1fr))', gap: 12 }}>
          {[['Open tickets', openTickets, '#60A5FA'], ['In progress', inProgress, '#FBBF24'], ['Waiting for customer', supportTickets.filter((ticket) => ticket.status === 'WAITING_FOR_CUSTOMER').length, '#A78BFA'], ['Escalated', escalated, '#F87171'], ['Resolved today', resolved, '#34D399'], ['Avg response time', '—', '#22D3EE']].map(([label, value, color]) => <div key={String(label)} style={{ background: c.panel, border: `1px solid ${c.border}`, borderRadius: 14, padding: 15, boxShadow: '0 8px 24px rgba(2,6,23,.06)' }}><div style={{ color: c.muted, fontSize: 11 }}>{label}</div><strong style={{ display: 'block', marginTop: 7, color: String(color), fontSize: 22 }}>{value}</strong></div>)}
        </div>
        <div style={{ display: 'none' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 18 }}><GitBranch size={17} color="#60A5FA" /><h2 style={{ margin: 0, color: c.text, fontSize: 17 }}>Connected case workflow</h2></div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(120px,1fr))', gap: 10, alignItems: 'center' }}>{[['Buyer / Seller', 'Create support ticket', '#60A5FA'], ['Admin queue', 'Assign · reply · note', '#A78BFA'], ['Normal issue', 'Support investigation', '#34D399'], ['Serious issue', 'Dispute investigation', '#F87171'], ['Resolution', 'Resolve with decision', '#FBBF24'], ['Closed', 'Audit trail retained', '#22D3EE']].map(([title, description, color], index) => <React.Fragment key={String(title)}><div style={{ minHeight: 92, display: 'flex', flexDirection: 'column', justifyContent: 'center', background: c.soft, border: `1px solid ${c.border}`, borderRadius: 12, padding: 12, textAlign: 'center' }}><strong style={{ color: String(color), fontSize: 12 }}>{title}</strong><span style={{ color: c.muted, fontSize: 10, marginTop: 6, lineHeight: 1.4 }}>{description}</span></div>{index < 5 && <ArrowRight size={15} color={c.muted} style={{ justifySelf: 'center' }} />}</React.Fragment>)}</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 9, marginTop: 18 }}><button onClick={() => setTab('TICKETS')} style={{ ...buttonStyle, background: '#2563EB', borderColor: '#2563EB', color: '#FFF' }}>Open support queue <ArrowRight size={13} style={{ verticalAlign: 'middle', marginLeft: 5 }} /></button><button onClick={() => setTab('DISPUTES')} style={buttonStyle}>Review disputes</button></div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,330px),1fr))', gap: 14 }}>{supportTickets.slice(0, 3).map((ticket) => <TicketCard key={ticket.id} ticket={ticket} c={c} onOpen={() => { setSelectedTicketId(ticket.id); setTab('TICKETS'); }} />)}</div>
      </>}

      {tab === 'TICKETS' && <>
        <div style={{ display: 'flex', gap: 9, flexWrap: 'wrap', padding: 12, background: c.soft, border: `1px solid ${c.border}`, borderRadius: 13 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: '1 1 280px', minWidth: 220, background: c.input, border: `1px solid ${c.border}`, borderRadius: 9, padding: '0 11px' }}><Search size={15} color={c.muted} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search ticket, customer, order..." style={{ width: '100%', border: 0, outline: 0, padding: '10px 0', background: 'transparent', color: c.text, fontSize: 12 }} /></div>
          <select value={ticketType} onChange={(event) => setTicketType(event.target.value as typeof ticketType)} style={selectStyle}><option value="ALL">All customer types</option><option value="BUYER">Buyers</option><option value="SELLER">Sellers</option></select>
          <select value={ticketStatus} onChange={(event) => setTicketStatus(event.target.value as typeof ticketStatus)} style={selectStyle}><option value="ALL">All statuses</option><option value="OPEN">Open</option><option value="IN_PROGRESS">In progress</option><option value="WAITING_FOR_CUSTOMER">Waiting for customer</option><option value="ESCALATED">Escalated</option><option value="RESOLVED">Resolved</option><option value="CLOSED">Closed</option></select>
        </div>
        <div style={{ overflowX: 'auto', background: c.panel, border: `1px solid ${c.border}`, borderRadius: 16, boxShadow: '0 8px 24px rgba(2,6,23,.06)' }}>
          <div style={{ minWidth: 920 }}><div style={{ display: 'grid', gridTemplateColumns: '130px minmax(260px,1.6fr) 100px 110px 150px 90px 80px', gap: 10, padding: '14px 18px', background: c.soft, color: c.muted, fontSize: 10, fontWeight: 800, textTransform: 'uppercase' }}><span>Ticket</span><span>Subject / customer</span><span>Type</span><span>Priority</span><span>Assigned agent</span><span>Status</span><span>Action</span></div>{filteredTickets.map((ticket) => { const serious = seriousIssue(ticket); const stage = stageFor(ticket); return <div className="support-row" key={ticket.id} style={{ display: 'grid', gridTemplateColumns: '130px minmax(260px,1.6fr) 100px 110px 150px 90px 80px', gap: 10, alignItems: 'center', padding: '15px 18px', borderTop: `1px solid ${c.border}`, color: c.text }}><strong style={{ color: '#60A5FA', fontSize: 11 }}>{ticket.ticketNumber}</strong><div><strong style={{ display: 'block', fontSize: 12 }}>{ticket.subject}</strong><span style={{ color: c.muted, fontSize: 10 }}>{ticket.raisedBy} · {ticket.orderNumber || 'No order linked'}</span></div><span style={{ color: c.muted, fontSize: 10 }}>{ticket.userType}</span><span style={{ color: serious ? '#F87171' : '#60A5FA', fontSize: 10, fontWeight: 800 }}>{ticket.priority}</span><span style={{ color: '#FBBF24', fontSize: 11 }}>{ticket.assignedTo}</span><span style={{ color: stage === 'CLOSED' || stage === 'RESOLVED' ? '#34D399' : serious ? '#F87171' : '#FBBF24', fontSize: 10, fontWeight: 800 }}>{stageLabel[stage]}</span><button onClick={() => setSelectedTicketId(ticket.id)} style={{ ...buttonStyle, color: '#60A5FA', borderColor: 'rgba(96,165,250,.45)', padding: '7px 9px' }}>View</button></div>; })}</div>
          {filteredTickets.length === 0 && <div style={{ padding: 34, color: c.muted, textAlign: 'center', fontSize: 12 }}>No tickets match these filters.</div>}
        </div>
      </>}

      {tab === 'DISPUTES' && <>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(150px,1fr))', gap: 12 }}>{[['Open / review', disputes.filter((dispute) => !['RESOLVED', 'CLOSED'].includes(dispute.status)).length, '#F87171'], ['Waiting for evidence', disputes.filter((dispute) => dispute.status.startsWith('WAITING')).length, '#FBBF24'], ['Resolved', disputes.filter((dispute) => dispute.status === 'RESOLVED').length, '#34D399'], ['Closed', disputes.filter((dispute) => dispute.status === 'CLOSED').length, '#60A5FA']].map(([label, value, color]) => <div key={String(label)} style={{ background: c.panel, border: `1px solid ${c.border}`, borderRadius: 14, padding: 15 }}><div style={{ color: c.muted, fontSize: 11 }}>{label}</div><strong style={{ display: 'block', marginTop: 7, color: String(color), fontSize: 22 }}>{value}</strong></div>)}</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,360px),1fr))', gap: 14 }}>{disputes.map((dispute) => <DisputeCard key={dispute.id} dispute={dispute} c={c} onOpen={() => setSelectedDisputeId(dispute.id)} />)}</div>
      </>}

      {selectedTicket && <TicketModal ticket={selectedTicket} c={c} dark={dark} messageMode={messageMode} setMessageMode={setMessageMode} draft={draft} setDraft={setDraft} submitMessage={submitMessage} noteDraft={noteDraft} setNoteDraft={setNoteDraft} submitNote={submitNote} onClose={() => setSelectedTicketId(null)} onAdvance={() => advanceTicket(selectedTicket)} updateTicketPriority={updateTicketPriority} updateTicketStatus={updateTicketStatus} updateTicketAssignment={updateTicketAssignment} showEscalation={showEscalation} setShowEscalation={setShowEscalation} escalation={escalation} setEscalation={setEscalation} submitEscalation={submitEscalation} />}
      {selectedDispute && <DisputeModal dispute={selectedDispute} c={c} dark={dark} onClose={() => setSelectedDisputeId(null)} updateDisputeStatus={updateDisputeStatus} requestDisputeInformation={requestDisputeInformation} evidenceName={evidenceName} setEvidenceName={setEvidenceName} evidenceDescription={evidenceDescription} setEvidenceDescription={setEvidenceDescription} addEvidence={addEvidence} resolutionType={resolutionType} setResolutionType={setResolutionType} resolutionNote={resolutionNote} setResolutionNote={setResolutionNote} submitResolution={submitResolution} closeDispute={closeDispute} />}
    </div>
  );
};

const TicketCard: React.FC<{ ticket: SupportTicket; c: Record<string, string>; onOpen: () => void }> = ({ ticket, c, onOpen }) => {
  const serious = seriousIssue(ticket);
  const stage = stageFor(ticket);
  return <article className="support-card" onClick={onOpen} style={{ background: c.panel, border: `1px solid ${serious && stage !== 'CLOSED' ? 'rgba(248,113,113,.5)' : c.border}`, borderRadius: 16, padding: 18, boxShadow: '0 8px 24px rgba(2,6,23,.07)', cursor: 'pointer' }}><div style={{ display: 'flex', justifyContent: 'space-between', gap: 10 }}><strong style={{ color: '#60A5FA', fontSize: 11 }}>{ticket.ticketNumber}</strong><span style={{ color: stage === 'RESOLVED' || stage === 'CLOSED' ? '#34D399' : serious ? '#F87171' : '#FBBF24', fontSize: 10, fontWeight: 800 }}>{stageLabel[stage]}</span></div><h2 style={{ color: c.text, fontSize: 16, lineHeight: 1.25, margin: '14px 0 5px' }}>{ticket.subject}</h2><p style={{ color: c.muted, fontSize: 11, margin: 0 }}>Raised by {ticket.raisedBy} · {ticket.userType}</p><div style={{ background: c.soft, borderRadius: 11, padding: 12, marginTop: 14, color: c.muted, fontSize: 11, lineHeight: 1.7 }}>Route: <strong style={{ color: serious ? '#F87171' : '#60A5FA' }}>{serious ? 'Dispute investigation' : 'Support team investigation'}</strong><br />Assigned agent: <strong style={{ color: '#FBBF24' }}>{ticket.assignedTo}</strong></div></article>;
};

const DisputeCard: React.FC<{ dispute: DisputeItem; c: Record<string, string>; onOpen: () => void }> = ({ dispute, c, onOpen }) => <article className="dispute-card" onClick={onOpen} style={{ background: c.panel, border: `1px solid ${c.border}`, borderRadius: 16, padding: 18, boxShadow: '0 8px 24px rgba(2,6,23,.07)', cursor: 'pointer' }}><div style={{ display: 'flex', justifyContent: 'space-between', gap: 10 }}><strong style={{ color: '#60A5FA', fontSize: 11 }}>{dispute.disputeNumber}</strong><span style={{ color: ['RESOLVED', 'CLOSED'].includes(dispute.status) ? '#34D399' : '#F87171', background: ['RESOLVED', 'CLOSED'].includes(dispute.status) ? 'rgba(16,185,129,.12)' : 'rgba(248,113,113,.12)', padding: '5px 9px', borderRadius: 999, fontSize: 10, fontWeight: 800 }}>{dispute.status.replace(/_/g, ' ')}</span></div><h2 style={{ color: c.text, fontSize: 16, margin: '14px 0 5px' }}>{dispute.reason}</h2><p style={{ color: c.muted, fontSize: 11, margin: 0 }}>{dispute.buyer} · {dispute.orderNumber || 'No order linked'}</p><div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, marginTop: 16, color: c.muted, fontSize: 11 }}><span>Agent: <strong style={{ color: '#FBBF24' }}>{dispute.assignedTo}</strong></span><strong style={{ color: '#34D399' }}>{dispute.disputedAmount ? `₹${dispute.disputedAmount.toLocaleString('en-IN')}` : 'No amount'}</strong></div></article>;

type TicketModalProps = { ticket: SupportTicket; c: Record<string, string>; dark: boolean; messageMode: 'PUBLIC' | 'INTERNAL'; setMessageMode: React.Dispatch<React.SetStateAction<'PUBLIC' | 'INTERNAL'>>; draft: string; setDraft: React.Dispatch<React.SetStateAction<string>>; submitMessage: () => void; noteDraft: string; setNoteDraft: React.Dispatch<React.SetStateAction<string>>; submitNote: () => void; onClose: () => void; onAdvance: () => void; updateTicketPriority: (id: string, priority: SupportTicket['priority']) => void; updateTicketStatus: (id: string, status: SupportTicket['status']) => void; updateTicketAssignment: (id: string, assignedTo: string) => void; showEscalation: boolean; setShowEscalation: React.Dispatch<React.SetStateAction<boolean>>; escalation: { reason: string; category: string; disputedAmount: string; assignedTo: string }; setEscalation: React.Dispatch<React.SetStateAction<{ reason: string; category: string; disputedAmount: string; assignedTo: string }>>; submitEscalation: () => void };

const TicketModal: React.FC<TicketModalProps> = ({ ticket, c, dark, messageMode, setMessageMode, draft, setDraft, submitMessage, noteDraft, setNoteDraft, submitNote, onClose, onAdvance, updateTicketPriority, updateTicketStatus, updateTicketAssignment, showEscalation, setShowEscalation, escalation, setEscalation, submitEscalation }) => {
  const stage = stageFor(ticket);
  const serious = seriousIssue(ticket);
  const path = workflowPath(ticket);
  const currentIndex = path.indexOf(stage);
  const next = nextStageFor(ticket);
  const messages = toMessages(ticket);
  const escalationDisabled = Boolean(ticket.disputeId);
  const inputStyle: React.CSSProperties = { width: '100%', boxSizing: 'border-box', border: `1px solid ${c.border}`, borderRadius: 9, padding: '10px 11px', background: c.input, color: c.text, fontSize: 12, outline: 'none' };
  return <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'grid', placeItems: 'center', padding: 20, background: 'rgba(2,6,23,.68)', backdropFilter: 'blur(8px)' }}><div onClick={(event) => event.stopPropagation()} style={{ width: 'min(100%, 980px)', maxHeight: 'min(850px, 94vh)', overflowY: 'auto', background: dark ? '#111827' : '#FFF', borderRadius: 18, padding: 24, color: c.text, boxShadow: '0 24px 70px rgba(0,0,0,.35)' }}><div style={{ display: 'flex', justifyContent: 'space-between', gap: 16 }}><div><div style={{ color: '#60A5FA', fontSize: 11, fontWeight: 800, letterSpacing: '.08em' }}>TICKET WORKSPACE · {ticket.ticketNumber}</div><h2 style={{ margin: '7px 0 5px', fontSize: 21 }}>{ticket.subject}</h2><p style={{ color: c.muted, fontSize: 12, margin: 0 }}>Raised by {ticket.raisedBy} · {ticket.category} · {ticket.orderNumber || 'No order linked'}</p></div><button onClick={onClose} aria-label="Close ticket details" style={{ border: 0, borderRadius: 8, width: 34, height: 34, background: dark ? 'rgba(255,255,255,.08)' : '#F1F5F9', color: c.muted, cursor: 'pointer' }}><X size={15} /></button></div>
    <div style={{ marginTop: 20, padding: 15, borderRadius: 12, background: c.soft, border: `1px solid ${c.border}` }}><div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 14 }}><GitBranch size={15} color="#60A5FA" /><strong style={{ fontSize: 13 }}>Routing workflow</strong><span style={{ marginLeft: 'auto', color: serious ? '#F87171' : '#60A5FA', fontSize: 10, fontWeight: 800 }}>{serious ? 'SERIOUS ISSUE' : 'NORMAL ISSUE'}</span></div><div style={{ display: 'grid', gridTemplateColumns: `repeat(${path.length * 2 - 1}, minmax(0, 1fr))`, gap: 6, alignItems: 'start' }}>{path.map((step, index) => <React.Fragment key={step}><div style={{ textAlign: 'center' }}><div style={{ width: 29, height: 29, margin: '0 auto 7px', borderRadius: 15, display: 'grid', placeItems: 'center', background: index <= currentIndex ? '#2563EB' : dark ? '#334155' : '#E2E8F0', color: index <= currentIndex ? '#FFF' : c.muted, fontSize: 10, fontWeight: 800 }}>{index < currentIndex ? <Check size={14} /> : index + 1}</div><div style={{ color: index === currentIndex ? c.text : c.muted, fontSize: 9, lineHeight: 1.35, fontWeight: index === currentIndex ? 800 : 600 }}>{stageLabel[step]}</div></div>{index < path.length - 1 && <div style={{ height: 2, marginTop: 14, background: index < currentIndex ? '#2563EB' : dark ? '#475569' : '#CBD5E1' }} />}</React.Fragment>)}</div></div>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(150px,1fr))', gap: 9, marginTop: 16 }}>{[['Current stage', stageLabel[stage], '#FBBF24'], ['Assigned agent', ticket.assignedTo, '#60A5FA'], ['Last update', ticket.lastUpdate, c.text]].map(([label, value, color]) => <div key={String(label)} style={{ background: c.soft, borderRadius: 10, padding: 11 }}><div style={{ color: c.muted, fontSize: 10 }}>{label}</div><strong style={{ display: 'block', marginTop: 4, color: String(color), fontSize: 12 }}>{value}</strong></div>)}</div>
    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1.4fr) minmax(250px,.8fr)', gap: 16, marginTop: 20 }}><div><div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 10 }}><MessageSquare size={15} color="#60A5FA" /><h3 style={{ margin: 0, fontSize: 14 }}>Conversation</h3></div><div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxHeight: 280, overflowY: 'auto' }}>{messages.map((message) => <div className="conversation-row" key={message.id} style={{ padding: 11, borderRadius: 10, background: c.soft, borderLeft: `3px solid ${messageColor(message.type, dark)}` }}><div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}><strong style={{ fontSize: 11 }}>{message.sender}</strong><span style={{ color: messageColor(message.type, dark), fontSize: 9, fontWeight: 800 }}>{message.type} · {message.timestamp}</span></div><p style={{ color: c.muted, fontSize: 11, lineHeight: 1.5, margin: '5px 0 0' }}>{message.message}</p></div>)}</div><div style={{ marginTop: 12, padding: 12, background: c.soft, border: `1px solid ${c.border}`, borderRadius: 11 }}><div style={{ display: 'flex', gap: 5, marginBottom: 8 }}>{(['PUBLIC', 'INTERNAL'] as const).map((mode) => <button key={mode} onClick={() => setMessageMode(mode)} style={{ ...buttonBase(c, mode === messageMode), color: mode === 'INTERNAL' ? '#FBBF24' : '#34D399' }}>{mode === 'PUBLIC' ? 'Public reply' : 'Internal note'}</button>)}</div><textarea value={draft} onChange={(event) => setDraft(event.target.value)} placeholder={messageMode === 'PUBLIC' ? 'Reply visible to buyer and seller...' : 'Private note for support and dispute teams...'} style={{ ...inputStyle, minHeight: 68, resize: 'vertical' }} /><button onClick={submitMessage} style={{ ...buttonBase(c, true), marginTop: 8, background: '#2563EB', borderColor: '#2563EB', color: '#FFF' }}>{messageMode === 'PUBLIC' ? 'Send public reply' : 'Save internal note'}</button></div></div><div><div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 10 }}><ShieldAlert size={15} color="#FBBF24" /><h3 style={{ margin: 0, fontSize: 14 }}>Admin controls</h3></div><div style={{ display: 'grid', gap: 8 }}><label style={{ color: c.muted, fontSize: 10 }}>Assigned agent<select value={ticket.assignedTo} onChange={(event) => updateTicketAssignment(ticket.id, event.target.value)} style={{ ...inputStyle, marginTop: 4 }}><option>Vikram Mehta</option><option>Rajesh Sharma</option><option>Sneha Patel</option><option>Priya Nair</option></select></label><label style={{ color: c.muted, fontSize: 10 }}>Priority<select value={ticket.priority} onChange={(event) => updateTicketPriority(ticket.id, event.target.value as SupportTicket['priority'])} style={{ ...inputStyle, marginTop: 4 }}><option value="HIGH">High</option><option value="MEDIUM">Medium</option><option value="LOW">Low</option></select></label><label style={{ color: c.muted, fontSize: 10 }}>Status<select value={ticket.status} onChange={(event) => updateTicketStatus(ticket.id, event.target.value as SupportTicket['status'])} style={{ ...inputStyle, marginTop: 4 }}><option value="OPEN">Open</option><option value="IN_PROGRESS">In progress</option><option value="WAITING_FOR_CUSTOMER">Waiting for customer</option><option value="ESCALATED">Escalated</option><option value="RESOLVED">Resolved</option><option value="CLOSED">Closed</option></select></label></div><div style={{ marginTop: 14, padding: 12, borderRadius: 10, background: c.soft, color: c.muted, fontSize: 11, lineHeight: 1.6 }}><div><strong style={{ color: c.text }}>Related order</strong><br />{ticket.orderNumber || 'No order linked'}</div><div style={{ marginTop: 8 }}><strong style={{ color: c.text }}>User type</strong><br />{ticket.userType === 'BUYER' ? 'Buyer account' : 'Seller account'}</div></div><div style={{ marginTop: 14 }}><div style={{ display: 'flex', gap: 7 }}><input value={noteDraft} onChange={(event) => setNoteDraft(event.target.value)} placeholder="Add private note..." style={inputStyle} /><button onClick={submitNote} aria-label="Add private note" style={{ ...buttonBase(c, true), background: '#F59E0B', borderColor: '#F59E0B', color: '#111827', padding: '0 13px' }}>+</button></div>{(ticket.internalNotes || []).map((note) => <div key={note.id} style={{ marginTop: 8, padding: 9, borderRadius: 9, background: 'rgba(245,158,11,.1)', color: '#FBBF24', fontSize: 10 }}>{note.note}<div style={{ marginTop: 4, opacity: .75 }}>{note.author} · {note.timestamp}</div></div>)}</div></div></div>
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 20, paddingTop: 16, borderTop: `1px solid ${c.border}` }}><button onClick={() => setShowEscalation((value) => !value)} disabled={escalationDisabled} style={{ ...buttonBase(c, false), color: escalationDisabled ? c.muted : '#F87171', borderColor: escalationDisabled ? c.border : 'rgba(248,113,113,.45)', opacity: escalationDisabled ? .6 : 1 }}>{escalationDisabled ? 'Dispute linked' : 'Escalate to dispute'}</button>{next && <button onClick={onAdvance} style={{ ...buttonBase(c, true), flex: 1, background: next === 'CLOSED' ? '#10B981' : '#2563EB', borderColor: next === 'CLOSED' ? '#10B981' : '#2563EB', color: '#FFF' }}>{next === 'CLOSED' ? 'Close ticket' : `Move to ${stageLabel[next]}`} <ArrowRight size={14} style={{ verticalAlign: 'middle', marginLeft: 5 }} /></button>}</div>
    {showEscalation && <div style={{ marginTop: 14, padding: 14, borderRadius: 12, background: 'rgba(248,113,113,.08)', border: '1px solid rgba(248,113,113,.35)' }}><div style={{ display: 'flex', alignItems: 'center', gap: 7, color: '#F87171', fontSize: 12, fontWeight: 800 }}><AlertTriangle size={15} /> Create linked dispute</div><div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1.5fr) minmax(150px,.7fr) minmax(130px,.6fr)', gap: 8, marginTop: 10 }}><input value={escalation.reason} onChange={(event) => setEscalation((value) => ({ ...value, reason: event.target.value }))} placeholder="Reason for escalation" style={inputStyle} /><input value={escalation.category} onChange={(event) => setEscalation((value) => ({ ...value, category: event.target.value }))} placeholder="Category" style={inputStyle} /><input type="number" value={escalation.disputedAmount} onChange={(event) => setEscalation((value) => ({ ...value, disputedAmount: event.target.value }))} placeholder="Amount" style={inputStyle} /></div><button onClick={submitEscalation} style={{ ...buttonBase(c, true), marginTop: 9, background: '#F87171', borderColor: '#F87171', color: '#FFF' }}>Create dispute and route for review</button></div>}
  </div></div>;
};

const buttonBase = (c: Record<string, string>, filled: boolean): React.CSSProperties => ({ border: `1px solid ${c.border}`, borderRadius: 9, padding: '9px 11px', background: filled ? c.soft : 'transparent', color: c.text, fontSize: 10, fontWeight: 800, cursor: 'pointer' });

type DisputeModalProps = { dispute: DisputeItem; c: Record<string, string>; dark: boolean; onClose: () => void; updateDisputeStatus: (id: string, status: DisputeStatus) => void; requestDisputeInformation: (id: string, from: 'BUYER' | 'SELLER') => void; evidenceName: string; setEvidenceName: React.Dispatch<React.SetStateAction<string>>; evidenceDescription: string; setEvidenceDescription: React.Dispatch<React.SetStateAction<string>>; addEvidence: () => void; resolutionType: NonNullable<DisputeItem['resolution']>['type']; setResolutionType: React.Dispatch<React.SetStateAction<NonNullable<DisputeItem['resolution']>['type']>>; resolutionNote: string; setResolutionNote: React.Dispatch<React.SetStateAction<string>>; submitResolution: () => void; closeDispute: (id: string) => void };

const DisputeModal: React.FC<DisputeModalProps> = ({ dispute, c, dark, onClose, updateDisputeStatus, requestDisputeInformation, evidenceName, setEvidenceName, evidenceDescription, setEvidenceDescription, addEvidence, resolutionType, setResolutionType, resolutionNote, setResolutionNote, submitResolution, closeDispute }) => {
  const inputStyle: React.CSSProperties = { width: '100%', boxSizing: 'border-box', border: `1px solid ${c.border}`, borderRadius: 9, padding: '10px 11px', background: dark ? 'rgba(15,23,42,.66)' : '#FFF', color: c.text, fontSize: 12, outline: 'none' };
  const finished = dispute.status === 'RESOLVED' || dispute.status === 'CLOSED';
  return <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 1001, display: 'grid', placeItems: 'center', padding: 20, background: 'rgba(2,6,23,.68)', backdropFilter: 'blur(8px)' }}><div onClick={(event) => event.stopPropagation()} style={{ width: 'min(100%, 900px)', maxHeight: 'min(850px, 94vh)', overflowY: 'auto', background: dark ? '#111827' : '#FFF', borderRadius: 18, padding: 24, color: c.text, boxShadow: '0 24px 70px rgba(0,0,0,.35)' }}><div style={{ display: 'flex', justifyContent: 'space-between', gap: 16 }}><div><div style={{ color: '#F87171', fontSize: 11, fontWeight: 800, letterSpacing: '.08em' }}>DISPUTE REVIEW · {dispute.disputeNumber}</div><h2 style={{ margin: '7px 0 5px', fontSize: 21 }}>{dispute.reason}</h2><p style={{ color: c.muted, fontSize: 12, margin: 0 }}>Linked ticket {dispute.ticketId} · Order {dispute.orderNumber || 'not linked'}</p></div><button onClick={onClose} aria-label="Close dispute details" style={{ border: 0, borderRadius: 8, width: 34, height: 34, background: dark ? 'rgba(255,255,255,.08)' : '#F1F5F9', color: c.muted, cursor: 'pointer' }}><X size={15} /></button></div><div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(150px,1fr))', gap: 9, marginTop: 18 }}>{[['Status', dispute.status.replace(/_/g, ' '), finished ? '#34D399' : '#FBBF24'], ['Buyer', dispute.buyer, '#60A5FA'], ['Seller', dispute.seller, '#A78BFA'], ['Disputed amount', dispute.disputedAmount ? `₹${dispute.disputedAmount.toLocaleString('en-IN')}` : 'No amount', '#34D399']].map(([label, value, color]) => <div key={String(label)} style={{ background: c.soft, borderRadius: 10, padding: 11 }}><div style={{ color: c.muted, fontSize: 10 }}>{label}</div><strong style={{ display: 'block', color: String(color), fontSize: 11, marginTop: 4 }}>{value}</strong></div>)}</div><div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1.1fr) minmax(250px,.9fr)', gap: 16, marginTop: 20 }}><div><SectionTitle icon={<FileText size={15} color="#60A5FA" />} title="Evidence & investigation" c={c} /><div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>{dispute.evidence.length ? dispute.evidence.map((evidence) => <div key={evidence.id} style={{ display: 'flex', gap: 9, padding: 10, background: c.soft, borderRadius: 10 }}><Paperclip size={14} color="#60A5FA" /><div style={{ minWidth: 0 }}><strong style={{ display: 'block', fontSize: 11 }}>{evidence.fileName}</strong><span style={{ color: c.muted, fontSize: 10 }}>{evidence.uploadedBy} · {evidence.role} · {evidence.uploadedAt}</span><p style={{ margin: '4px 0 0', color: c.muted, fontSize: 10 }}>{evidence.description}</p></div></div>) : <div style={{ padding: 16, background: c.soft, borderRadius: 10, color: c.muted, fontSize: 11 }}>No evidence uploaded yet.</div>}</div>{!finished && <div style={{ marginTop: 12, padding: 12, background: c.soft, borderRadius: 11 }}><input value={evidenceName} onChange={(event) => setEvidenceName(event.target.value)} placeholder="Evidence file name" style={inputStyle} /><input value={evidenceDescription} onChange={(event) => setEvidenceDescription(event.target.value)} placeholder="What does it prove?" style={{ ...inputStyle, marginTop: 7 }} /><button onClick={addEvidence} style={{ ...buttonBase(c, true), marginTop: 8, color: '#60A5FA' }}>Add evidence</button></div>}<div style={{ display: 'flex', gap: 7, flexWrap: 'wrap', marginTop: 12 }}><button onClick={() => requestDisputeInformation(dispute.id, 'BUYER')} disabled={finished} style={{ ...buttonBase(c, false), color: '#60A5FA', opacity: finished ? .5 : 1 }}>Request buyer information</button><button onClick={() => requestDisputeInformation(dispute.id, 'SELLER')} disabled={finished} style={{ ...buttonBase(c, false), color: '#A78BFA', opacity: finished ? .5 : 1 }}>Request seller information</button></div></div><div><SectionTitle icon={<GitBranch size={15} color="#FBBF24" />} title="Case timeline" c={c} /><div style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>{dispute.timeline.map((item) => <div key={item.id} style={{ display: 'grid', gridTemplateColumns: '12px 1fr', gap: 9 }}><div style={{ width: 10, height: 10, marginTop: 3, borderRadius: 5, background: '#2563EB' }} /><div><strong style={{ display: 'block', fontSize: 11 }}>{item.label}</strong><p style={{ margin: '3px 0', color: c.muted, fontSize: 10, lineHeight: 1.45 }}>{item.description}</p><span style={{ color: c.muted, fontSize: 9 }}>{item.actor} · {item.timestamp}</span></div></div>)}</div></div></div>{!finished && <div style={{ marginTop: 20, paddingTop: 16, borderTop: `1px solid ${c.border}` }}><SectionTitle icon={<CheckCircle2 size={15} color="#34D399" />} title="Final resolution" c={c} /><div style={{ display: 'grid', gridTemplateColumns: 'minmax(180px,.7fr) minmax(0,1.3fr)', gap: 8 }}><select value={resolutionType} onChange={(event) => setResolutionType(event.target.value as NonNullable<DisputeItem['resolution']>['type'])} style={inputStyle}><option value="FULL_REFUND">Full refund</option><option value="PARTIAL_REFUND">Partial refund</option><option value="REPLACEMENT">Replacement</option><option value="RETURN_PRODUCT">Return product</option><option value="RELEASE_PAYMENT_TO_SELLER">Release payment to seller</option><option value="REJECT_DISPUTE">Reject dispute</option><option value="CUSTOM_RESOLUTION">Custom resolution</option></select><input value={resolutionNote} onChange={(event) => setResolutionNote(event.target.value)} placeholder="Resolution note and customer communication" style={inputStyle} /></div><button onClick={submitResolution} style={{ ...buttonBase(c, true), marginTop: 9, background: '#10B981', borderColor: '#10B981', color: '#FFF' }}>Confirm resolution</button></div>}{finished && dispute.status === 'RESOLVED' && <button onClick={() => closeDispute(dispute.id)} style={{ ...buttonBase(c, true), width: '100%', marginTop: 20, background: '#2563EB', borderColor: '#2563EB', color: '#FFF' }}>Close dispute and linked ticket</button>}{dispute.status === 'UNDER_REVIEW' && <button onClick={() => updateDisputeStatus(dispute.id, 'OPEN')} style={{ ...buttonBase(c, false), marginTop: 12, color: '#FBBF24' }}>Move back to open queue</button>}</div></div>;
};

const SectionTitle: React.FC<{ icon: React.ReactNode; title: string; c: Record<string, string> }> = ({ icon, title, c }) => <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 10 }}><span>{icon}</span><h3 style={{ margin: 0, fontSize: 14, color: c.text }}>{title}</h3></div>;
