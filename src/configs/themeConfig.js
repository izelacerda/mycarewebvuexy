// You can customize the theme with the help of this file

//Template config options
const themeConfig = {
  layout: localStorage.getItem("activeLayout") ?  localStorage.getItem("activeLayout") : "vertical", // options[String]: "vertical"(default), "horizontal"
  theme: "light", // options[String]: 'light'(default), 'dark', 'semi-dark'
  sidebarCollapsed: false, // options[Boolean]: true, false(default)
  navbarColor: "default", // options[String]: default / primary / success / danger / info / warning / dark
  navbarType: "floating", // options[String]: floating(default) / static / sticky / hidden
  footerType: "static", // options[String]: static(default) / sticky / hidden
  disableCustomizer: localStorage.getItem("customizer") ?  localStorage.getItem("customizer") : false, // options[Boolean]: true, false(default)
  hideScrollToTop: false, // options[Boolean]: true, false(default)
  disableThemeTour: false, // options[Boolean]: true, false(default)
  menuTheme: "primary", // options[String]: primary / success / danger / info / warning / dark
  direction: localStorage.getItem("direction") ?  localStorage.getItem("direction") : "ltr" // options[String] : ltr / rtl
};

export default themeConfig
