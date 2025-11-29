export const sendSupportEmail = async ({
  name,
  email,
  phone,
  message,
  issueType,
  priority,
}) => {
  const url = "https://api.emailjs.com/api/v1.0/email/send";

  const payload = {
    service_id: import.meta.env.VITE_EMAILJS_SERVICE_ID,
    template_id: import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
    user_id: import.meta.env.VITE_EMAILJS_PUBLIC_KEY,

    template_params: {
      from_name: name,
      from_email: email,
      phone_number: phone || "Not Provided",
      issue_type: issueType,
      priority_level: priority,
      support_message: message,
      submitted_at: new Date().toLocaleString(), // optional
    },
  };

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`EmailJS error: ${errText}`);
    }

    // return await res.json();
    return await res.text(); 
  } catch (error) {
    console.error("EmailJS Error:", error);
    throw error;
  }
};
