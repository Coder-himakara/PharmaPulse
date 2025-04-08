import { format } from 'date-fns';

const formatBackendDate = (dateInput) => {
  try {
    // Handle LocalDateTime array format from Java backend
    if (Array.isArray(dateInput) && dateInput.length >= 3) {
      const [year, month, day, hour = 0, minute = 0] = dateInput;
      const date = new Date(year, month - 1, day, hour, minute);
      return format(date, 'MM/dd/yyyy');
    }

    // Handle other date formats as before...
    if (typeof dateInput === 'string') {
      return format(new Date(dateInput), 'MM/dd/yyyy');
    } else if (dateInput instanceof Date) {
      return format(dateInput, 'MM/dd/yyyy');
    }

    return 'Invalid date format';
  } catch (error) {
    console.error('Date formatting error:', error, dateInput);
    return 'Date error';
  }
};

export default formatBackendDate;
