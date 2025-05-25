/**
 * Global configuration and utility class for the ProjectHelp application.
 * Provides constants, helper methods, and shared data structures used throughout the application.
 */
export class Globals {
  
 /**
   * Generates an ISO-8601 formatted date-time string in the specified timezone.
   * @param timeZone - The IANA timezone identifier (e.g., 'Asia/Manila', 'America/New_York')
   * @returns ISO-8601 formatted date-time string with 'Z' suffix
   */
  public static getCurrentDateTimeInISOFormat(timeZone: string): string {
    const date = new Date();
    return (
      new Intl.DateTimeFormat('sv-SE', {
        timeZone,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      })
        .format(date)
        .replace(' ', 'T') + 'Z'
    );
  }

  /**
   * Checks if a string is null, undefined, empty, or contains only whitespace.
   * @param input - The string to check
   * @returns True if the string is null, undefined, empty, or whitespace; otherwise, false
   */
  public static isNullOrWhiteSpace(input: string | null | undefined): boolean {
    return !input || input.trim().length === 0;
  }

  /**
   * Recursively converts an object to FormData, preserving nested structure using dot notation.
   * Handles various data types including Dates, Files, Arrays, and nested objects.
   * @param formData - The FormData instance to append values to
   * @param obj - The object to convert to FormData
   * @param parentKey - Optional prefix for nested properties (used in recursion)
   */
  public static appendObjectToFormData(
    formData: FormData,
    obj: any,
    parentKey: string = ''
  ): void {
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        const propName = parentKey ? `${parentKey}.${key}` : key;
        const value = obj[key] !== undefined ? obj[key] : '';
        if (value instanceof Date) {
          formData.append(propName, value.toISOString());
        } else if (value instanceof File) {
          formData.append(propName, value);
        } else if (Array.isArray(value)) {
          value.forEach((element, index) => {
            const arrayKey = `${propName}[${index}]`;
            if (typeof element === 'object' && element !== null) {
              this.appendObjectToFormData(formData, element, arrayKey);
            } else {
              formData.append(arrayKey, element !== undefined ? element : '');
            }
          });
        } else if (typeof value === 'object' && value !== null) {
          this.appendObjectToFormData(formData, value, propName);
        } else {
          formData.append(propName, value);
        }
      }
    }
  }

  /**
   * Appends an array of File objects to a FormData instance.
   * All files are added under the same key name 'files'.
   * @param formData - The FormData instance to append files to
   * @param filesToUpload - Array of File objects to add to the FormData
   */
  public static appendFilesToFormData(
    formData: FormData,
    filesToUpload: File[]
  ): void {
    for (let i = 0; i < filesToUpload.length; i++) {
      formData.append('files', filesToUpload[i]);
    }
  }
}
