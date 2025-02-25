
interface EmailData {
  to: string;
  subject: string;
  body: string;
}

export const sendEmail = async (data: EmailData): Promise<void> => {
  // In a real application, this would make an API call to a backend service
  // For now, we'll just log the email data
  console.log('Email sent:', {
    to: data.to,
    subject: data.subject,
    body: data.body
  });
  
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000));
};
