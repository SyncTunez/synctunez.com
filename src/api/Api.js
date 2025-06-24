export class UserApi {
  static getActiveUser() {
    const userJson = localStorage.getItem('activeUser')
    if (!userJson) return null
    try {
      return JSON.parse(userJson)
    } catch {
      console.warn('Failed to parse activeUser from localStorage')
      return null
    }
  }
}
