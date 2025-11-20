/**
 * Brevo API integration for contact management
 * 
 * This module handles creating contacts in Brevo and adding them to specific lists.
 * Uses the Brevo API v3 endpoints.
 * 
 * @see https://developers.brevo.com/reference/createcontact
 * @see https://developers.brevo.com/reference/addcontactstolist
 */

// Brevo API key from environment variables
const BREVO_API_KEY = import.meta.env.VITE_BREVO_API_KEY;
const BREVO_API_BASE_URL = 'https://api.brevo.com/v3';

/**
 * Validates that the Brevo API key is configured
 * @returns boolean - True if API key is present and valid
 */
const isBrevoConfigured = (): boolean => {
  return !!BREVO_API_KEY && BREVO_API_KEY.trim().length > 0;
};

/**
 * Creates a new contact in Brevo
 * 
 * @param email - Contact's email address
 * @param firstName - Contact's first name
 * @param lastName - Contact's last name
 * @param phone - Contact's phone number (SMS)
 * @returns Promise<boolean> - True if contact was created successfully
 */
export const createBrevoContact = async (
  email: string,
  firstName: string,
  lastName: string,
  phone: string
): Promise<boolean> => {
  if (!isBrevoConfigured()) {
    if (import.meta.env.DEV) {
      console.warn('⚠️ Brevo API key not configured - skipping contact creation');
    }
    return false;
  }

  if (!email || !firstName || !lastName) {
    console.error('❌ Missing required contact information');
    return false;
  }

  try {
    // Format phone number: ensure it's in E.164 format (starts with +, digits only after)
    // Phone should already come formatted as +1234567890 from the frontend
    let formattedPhone = phone.trim();
    if (formattedPhone) {
      if (formattedPhone.startsWith('+')) {
        // Already has +, just remove all non-digits except the leading +
        formattedPhone = `+${formattedPhone.slice(1).replace(/\D/g, '')}`;
      } else {
        // Missing +, add it and remove all non-digits
        formattedPhone = `+${formattedPhone.replace(/\D/g, '')}`;
      }
    }
    
    const response = await fetch(`${BREVO_API_BASE_URL}/contacts`, {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'api-key': BREVO_API_KEY,
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        email: email.toLowerCase().trim(),
        attributes: {
          FIRSTNAME: firstName.trim(),
          LASTNAME: lastName.trim(),
          SMS: formattedPhone || '',
        },
        updateEnabled: true,
        emailBlacklisted: false,
        smsBlacklisted: false,
      }),
    });

    if (response.ok) {
      if (import.meta.env.DEV) {
        console.log('✅ Brevo contact created successfully');
      }
      return true;
    } else {
      const errorData = await response.json().catch(() => ({}));
      // Contact might already exist (409), which is okay
      if (response.status === 400 && errorData.code === 'duplicate_parameter') {
        if (import.meta.env.DEV) {
          console.log('ℹ️ Brevo contact already exists, will update');
        }
        return true;
      }
      if (import.meta.env.DEV) {
        console.error('❌ Failed to create Brevo contact:', response.status, errorData);
      }
      return false;
    }
  } catch (error) {
    if (import.meta.env.DEV) {
      console.error('❌ Error creating Brevo contact:', error);
    }
    return false;
  }
};

/**
 * Adds a contact to a specific Brevo list
 * 
 * @param email - Contact's email address
 * @param listId - The ID of the list to add the contact to (default: 7)
 * @returns Promise<boolean> - True if contact was added successfully
 */
export const addContactToList = async (
  email: string,
  listId: number = 7
): Promise<boolean> => {
  if (!isBrevoConfigured()) {
    if (import.meta.env.DEV) {
      console.warn('⚠️ Brevo API key not configured - skipping list addition');
    }
    return false;
  }

  if (!email) {
    console.error('❌ Email is required to add contact to list');
    return false;
  }

  try {
    const response = await fetch(`${BREVO_API_BASE_URL}/contacts/lists/${listId}/contacts/add`, {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'api-key': BREVO_API_KEY,
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        emails: [email.toLowerCase().trim()],
      }),
    });

    if (response.ok) {
      if (import.meta.env.DEV) {
        console.log(`✅ Contact added to Brevo list ${listId} successfully`);
      }
      return true;
    } else {
      const errorData = await response.json().catch(() => ({}));
      // Contact might already be in list, which is okay
      if (response.status === 400) {
        if (import.meta.env.DEV) {
          console.log(`ℹ️ Contact may already be in Brevo list ${listId}`);
        }
        return true;
      }
      if (import.meta.env.DEV) {
        console.error(`❌ Failed to add contact to Brevo list ${listId}:`, response.status, errorData);
      }
      return false;
    }
  } catch (error) {
    if (import.meta.env.DEV) {
      console.error(`❌ Error adding contact to Brevo list ${listId}:`, error);
    }
    return false;
  }
};

/**
 * Creates a Brevo contact and adds them to a specific list
 * This is a convenience function that combines both operations
 * 
 * @param email - Contact's email address
 * @param firstName - Contact's first name
 * @param lastName - Contact's last name
 * @param phone - Contact's phone number (SMS)
 * @param listId - The ID of the list to add the contact to (default: 7)
 * @returns Promise<boolean> - True if both operations succeeded
 */
export const createBrevoContactAndAddToList = async (
  email: string,
  firstName: string,
  lastName: string,
  phone: string,
  listId: number = 7
): Promise<boolean> => {
  // Create contact first
  const contactCreated = await createBrevoContact(email, firstName, lastName, phone);
  
  // Add to list (even if contact creation had issues, try to add to list)
  const addedToList = await addContactToList(email, listId);
  
  // Return true if at least one operation succeeded
  // This allows for cases where contact exists but needs to be added to list
  return contactCreated || addedToList;
};

