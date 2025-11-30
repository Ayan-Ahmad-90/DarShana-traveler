import SupportTicket from '../../models/SupportTicket.js';

export const createSupportTicket = async (payload: Record<string, unknown>) => {
  return SupportTicket.create(payload);
};

export const addSupportReply = async (
  ticketId: string,
  message: { sender: string; body: string; attachments?: string[] }
) => {
  return SupportTicket.findByIdAndUpdate(
    ticketId,
    {
      $push: {
        messages: {
          sender: message.sender,
          body: message.body,
          attachments: message.attachments,
          createdAt: new Date()
        }
      }
    },
    { new: true }
  );
};

export const listSupportTickets = async (filters: Record<string, unknown> = {}) => {
  return SupportTicket.find(filters).sort({ updatedAt: -1 });
};

export const updateSupportStatus = async (ticketId: string, status: string, assignedTo?: string) => {
  return SupportTicket.findByIdAndUpdate(
    ticketId,
    { status, assignedTo },
    { new: true }
  );
};
