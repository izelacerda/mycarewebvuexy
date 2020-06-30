import React from "react"
import * as Icon from "react-feather"

const horizontalMenuConfig = [
  {
    id: "dashboard",
    title: "Dashboard",
    type: "dropdown",
    icon: <Icon.Home size={16} />,
    children: [
      {
        id: "analyticsDash",
        title: "Analytics",
        type: "item",
        icon: <Icon.Circle size={10} />,
        navLink: "/",
        userPermission: 1,
        permissions: ["admin", "editor"]
      },
      {
        id: "eCommerceDash",
        title: "eCommerce",
        type: "item",
        icon: <Icon.Circle size={10} />,
        navLink: "/ecommerce-dashboard",
        userPermission: 1,
        permissions: ["admin"]
      }
    ]
  },
  {
    id: "doctoroffice",
    title: "Doctor's Office",
    type: "dropdown",
    icon: <Icon.Activity size={16} />,
    children: [
      {
        id: "professionals",
        title: "Professionals",
        type: "item",
        icon: <Icon.Shield size={20} />,
        permissions: ["admin"],
        userPermission: 25,
        navLink: "/app/provider/list"
      },
      {
        id: "customer",
        title: "Pacients",
        type: "item",
        icon: <Icon.Heart size={20} />,
        permissions: ["admin"],
        userPermission: 31,
        navLink: "/app/customer/list"
      }
    ]
  },
  // {
  //   id: "apps",
  //   title: "Apps",
  //   type: "dropdown",
  //   icon: <Icon.Grid size={16} />,
  //   children: [
      // {
      //   id: "email",
      //   title: "Email",
      //   type: "item",
      //   icon: <Icon.Mail size={16} />,
      //   navLink: "/email/:filter",
      //   filterBase: "/email/inbox",
      //   userPermission: 1,
      //   permissions: ["admin", "editor"]
      // },
      // {
      //   id: "chat",
      //   title: "Chat",
      //   type: "item",
      //   icon: <Icon.MessageSquare size={16} />,
      //   navLink: "/chat",
      //   userPermission: 1,
      //   permissions: ["admin", "editor"]
      // },
      // {
      //   id: "todo",
      //   title: "Todo",
      //   type: "item",
      //   icon: <Icon.CheckSquare size={16} />,
      //   navLink: "/todo/:filter",
      //   filterBase: "/todo/all",
      //   userPermission: 1,
      //   permissions: ["admin", "editor"]
      // },
  //     {
  //       id: "calendar",
  //       title: "Calendar",
  //       type: "item",
  //       icon: <Icon.Calendar size={16} />,
  //       navLink: "/appointment",
  //       userPermission: 1,
  //       permissions: ["admin", "editor"]
  //     },
  //     {
  //       id: "eCommerce",
  //       title: "Ecommerce",
  //       type: "dropdown",
  //       icon: <Icon.ShoppingCart size={16} />,
  //       children: [
  //         {
  //           id: "shop",
  //           title: "Shop",
  //           type: "item",
  //           icon: <Icon.Circle size={10} />,
  //           navLink: "/ecommerce/shop",
  //           userPermission: 1,
  //           permissions: ["admin", "editor"]
  //         },
  //         {
  //           id: "detail",
  //           title: "Product Detail",
  //           type: "item",
  //           icon: <Icon.Circle size={10} />,
  //           navLink: "/ecommerce/product-detail",
  //           userPermission: 1,
  //           permissions: ["admin", "editor"]
  //         },
  //         {
  //           id: "wishList",
  //           title: "Wish List",
  //           type: "item",
  //           icon: <Icon.Circle size={10} />,
  //           navLink: "/ecommerce/wishlist",
  //           userPermission: 1,
  //           permissions: ["admin", "editor"]
  //         },
  //         {
  //           id: "checkout",
  //           title: "Checkout",
  //           type: "item",
  //           icon: <Icon.Circle size={10} />,
  //           navLink: "/ecommerce/checkout",
  //           userPermission: 1,
  //           permissions: ["admin", "editor"]
  //         }
  //       ]
  //     },
  //     {
  //       id: "usersApp",
  //       title: "Tables",
  //       type: "dropdown",
  //       icon: <Icon.Copy size={20} />,
  //       children: [
  //         {
  //           id: "userList",
  //           title: "Users",
  //           type: "item",
  //           icon: <Icon.User size={20} />,
  //           userPermission: 1,
  //           permissions: ["admin", "editor"],
  //           navLink: "/app/user/list"
  //         }
  //       ]
  //     }
  //   ]
  // },
  {
    id: "tables",
    title: "Tables",
    type: "dropdown",
    icon: <Icon.Copy size={20} />,
    children: [
      {
        id: "general",
        title: "General",
        type: "dropdown",
        icon: <Icon.MoreHorizontal size={20} />,
        children: [
          {
            id: "company",
            title: "Companies",
            type: "item",
            icon: <Icon.Globe size={20} />,
            permissions: ["admin"],
            userPermission: 43,
            navLink: "/app/company/list"
          },
          {
            id: "measure",
            title: "Measure unit",
            type: "item",
            icon: <Icon.Globe size={20} />,
            permissions: ["admin"],
            userPermission: 55,
            navLink: "/app/measure/list"
          },
          {
            id: "material",
            title: "Materials",
            type: "item",
            icon: <Icon.Globe size={20} />,
            permissions: ["admin"],
            userPermission: 61,
            navLink: "/app/material/list"
          },
          {
            id: "financialaccount",
            title: "Financial Plan",
            type: "item",
            icon: <Icon.Globe size={20} />,
            permissions: ["admin"],
            userPermission: 61,
            navLink: "/app/financialaccount/list"
          },
          {
            id: "accountingaccount",
            title: "Accounting Plan",
            type: "item",
            icon: <Icon.Globe size={20} />,
            permissions: ["admin"],
            userPermission: 61,
            navLink: "/app/accountingaccount/list"
          }
        ]
      }
    ]
  },
  {
    id: "financial",
    title: "Financial",
    type: "collapse",
    icon: <Icon.DollarSign size={20} />,
    children: [
      {
        id: "invoice",
        title: "Invoice Providers",
        type: "item",
        icon: <Icon.DollarSign size={20} />,
        permissions: ["admin"],
        userPermission: 94,
        navLink: "/app/invoice/list"
      },
    ]
  },
  {
    id: "security",
    title: "Security",
    type: "dropdown",
    icon: <Icon.Lock size={20} />,
    children: [
      {
        id: "profiles",
        title: "Profiles",
        type: "item",
        icon: <Icon.User size={20} />,
        permissions: ["admin"],
        userPermission: 7,
        navLink: "/app/profile/list"
      },
      {
        id: "list",
        title: "Users",
        type: "item",
        icon: <Icon.Users size={20} />,
        permissions: ["admin"],
        userPermission: 1,
        navLink: "/app/user/list"
      },
      {
        id: "permission",
        title: "Permissions",
        type: "item",
        icon: <Icon.Unlock size={20} />,
        permissions: ["admin"],
        userPermission: 13,
        navLink: "/app/permission/list"
      }
    ]
  },
  {
    id: "uiElements",
    title: "UI Elements",
    type: "dropdown",
    icon: <Icon.Layers size={16} />,
    children: [
      {
        id: "dataView",
        title: "Data List",
        type: "dropdown",
        icon: <Icon.List size={16} />,
        children: [
          {
            id: "listView",
            title: "List View",
            type: "item",
            icon: <Icon.Circle size={10} />,
            userPermission: 1,
            permissions: ["admin", "editor"],
            navLink: "/data-list/list-view"
          },
          {
            id: "thumbView",
            title: "Thumb View",
            type: "item",
            icon: <Icon.Circle size={10} />,
            userPermission: 1,
            permissions: ["admin", "editor"],
            navLink: "/data-list/thumb-view"
          }
        ]
      },
      {
        id: "content",
        title: "Content",
        type: "dropdown",
        icon: <Icon.Layout size={16} />,
        children: [
          {
            id: "gird",
            title: "Grid",
            type: "item",
            icon: <Icon.Circle size={10} />,
            navLink: "/ui-element/grid",
            userPermission: 1,
            permissions: ["admin", "editor"]
          },
          {
            id: "typography",
            title: "Typography",
            type: "item",
            icon: <Icon.Circle size={10} />,
            navLink: "/ui-element/typography",
            userPermission: 1,
            permissions: ["admin", "editor"]
          },
          {
            id: "textUitlities",
            title: "Text Utilities",
            type: "item",
            icon: <Icon.Circle size={10} />,
            navLink: "/ui-element/textutilities",
            userPermission: 1,
            permissions: ["admin", "editor"]
          },
          {
            id: "syntaxHighlighter",
            title: "Syntax Highlighter",
            type: "item",
            icon: <Icon.Circle size={10} />,
            navLink: "/ui-element/syntaxhighlighter",
            userPermission: 1,
            permissions: ["admin", "editor"]
          }
        ]
      },
      {
        id: "colors",
        title: "Colors",
        type: "item",
        icon: <Icon.Droplet size={16} />,
        navLink: "/colors/colors",
        userPermission: 1,
        permissions: ["admin", "editor"]
      },
      {
        id: "icons",
        title: "Icons",
        type: "item",
        icon: <Icon.Eye size={16} />,
        navLink: "/icons/reactfeather",
        userPermission: 1,
        permissions: ["admin", "editor"]
      },
      {
        id: "cards",
        title: "Cards",
        type: "dropdown",
        icon: <Icon.CreditCard size={16} />,
        children: [
          {
            id: "basic",
            title: "Basic",
            type: "item",
            icon: <Icon.Circle size={10} />,
            navLink: "/cards/basic",
            userPermission: 1,
            permissions: ["admin", "editor"]
          },
          {
            id: "statistics",
            title: "Statistics",
            type: "item",
            icon: <Icon.Circle size={10} />,
            navLink: "/cards/statistics",
            userPermission: 1,
            permissions: ["admin", "editor"]
          },
          {
            id: "analytics",
            title: "Analytics",
            type: "item",
            icon: <Icon.Circle size={10} />,
            navLink: "/cards/analytics",
            userPermission: 1,
            permissions: ["admin", "editor"]
          },
          {
            id: "cardActions",
            title: "Card Actions",
            type: "item",
            icon: <Icon.Circle size={10} />,
            navLink: "/cards/action",
            userPermission: 1,
            permissions: ["admin", "editor"]
          }
        ]
      },
      {
        id: "components",
        title: "Components",
        type: "dropdown",
        icon: <Icon.Briefcase size={16} />,
        children: [
          {
            id: "alerts",
            title: "Alerts",
            type: "item",
            icon: <Icon.Circle size={10} />,
            navLink: "/components/alerts",
            userPermission: 1,
            permissions: ["admin", "editor"]
          },
          {
            id: "buttons",
            title: "Buttons",
            type: "item",
            icon: <Icon.Circle size={10} />,
            navLink: "/components/buttons",
            userPermission: 1,
            permissions: ["admin", "editor"]
          },
          {
            id: "breadCrumbs",
            title: "Breadcrumbs",
            type: "item",
            icon: <Icon.Circle size={10} />,
            navLink: "/components/breadcrumbs",
            userPermission: 1,
            permissions: ["admin", "editor"]
          },
          {
            id: "carousel",
            title: "Carousel",
            type: "item",
            icon: <Icon.Circle size={10} />,
            navLink: "/components/carousel",
            userPermission: 1,
            permissions: ["admin", "editor"]
          },
          {
            id: "dropDowns",
            title: "Dropdowns",
            type: "item",
            icon: <Icon.Circle size={10} />,
            navLink: "/components/dropdowns",
            userPermission: 1,
            permissions: ["admin", "editor"]
          },
          {
            id: "listGroup",
            title: "List Group",
            type: "item",
            icon: <Icon.Circle size={10} />,
            navLink: "/components/list-group",
            userPermission: 1,
            permissions: ["admin", "editor"]
          },
          {
            id: "modals",
            title: "Modals",
            type: "item",
            icon: <Icon.Circle size={10} />,
            navLink: "/components/modals",
            userPermission: 1,
            permissions: ["admin", "editor"]
          },
          {
            id: "pagination",
            title: "Pagination",
            type: "item",
            icon: <Icon.Circle size={10} />,
            navLink: "/components/pagination",
            userPermission: 1,
            permissions: ["admin", "editor"]
          },
          {
            id: "navsComponent",
            title: "Navs Component",
            type: "item",
            icon: <Icon.Circle size={10} />,
            navLink: "/components/nav-component",
            userPermission: 1,
            permissions: ["admin", "editor"]
          },
          {
            id: "navbar",
            title: "Navbar",
            type: "item",
            icon: <Icon.Circle size={10} />,
            navLink: "/components/navbar",
            userPermission: 1,
            permissions: ["admin", "editor"]
          },
          {
            id: "tabsComponent",
            title: "Tabs Component",
            type: "item",
            icon: <Icon.Circle size={10} />,
            navLink: "/components/tabs-component",
            userPermission: 1,
            permissions: ["admin", "editor"]
          },
          {
            id: "pillsComponent",
            title: "Pills Component",
            type: "item",
            icon: <Icon.Circle size={10} />,
            navLink: "/components/pills-component",
            userPermission: 1,
            permissions: ["admin", "editor"]
          },
          {
            id: "tooltips",
            title: "Tooltips",
            type: "item",
            icon: <Icon.Circle size={10} />,
            navLink: "/components/tooltips",
            userPermission: 1,
            permissions: ["admin", "editor"]
          },
          {
            id: "popovers",
            title: "Popovers",
            type: "item",
            icon: <Icon.Circle size={10} />,
            navLink: "/components/popovers",
            userPermission: 1,
            permissions: ["admin", "editor"]
          },
          {
            id: "badges",
            title: "Badges",
            type: "item",
            icon: <Icon.Circle size={10} />,
            navLink: "/components/badges",
            userPermission: 1,
            permissions: ["admin", "editor"]
          },
          {
            id: "pillBadges",
            title: "Pill Badges",
            type: "item",
            icon: <Icon.Circle size={10} />,
            navLink: "/components/pill-badges",
            userPermission: 1,
            permissions: ["admin", "editor"]
          },
          {
            id: "progress",
            title: "Progress",
            type: "item",
            icon: <Icon.Circle size={10} />,
            navLink: "/components/progress",
            userPermission: 1,
            permissions: ["admin", "editor"]
          },
          {
            id: "mediaObjects",
            title: "Media Objects",
            type: "item",
            icon: <Icon.Circle size={10} />,
            navLink: "/components/media-objects",
            userPermission: 1,
            permissions: ["admin", "editor"]
          },
          {
            id: "spinners",
            title: "Spinners",
            type: "item",
            icon: <Icon.Circle size={10} />,
            navLink: "/components/spinners",
            userPermission: 1,
            permissions: ["admin", "editor"]
          },
          {
            id: "toasts",
            title: "Toasts",
            type: "item",
            icon: <Icon.Circle size={10} />,
            navLink: "/components/toasts",
            userPermission: 1,
            permissions: ["admin", "editor"]
          }
        ]
      },
      {
        id: "extraComponents",
        title: "Extra Components",
        type: "dropdown",
        icon: <Icon.Box size={16} />,
        children: [
          {
            id: "autoComplete",
            title: "Auto Complete",
            type: "item",
            icon: <Icon.Circle size={10} />,
            navLink: "/extra-components/auto-complete",
            userPermission: 1,
            permissions: ["admin", "editor"]
          },
          {
            id: "avatar",
            title: "Avatar",
            type: "item",
            icon: <Icon.Circle size={10} />,
            navLink: "/extra-components/avatar",
            userPermission: 1,
            permissions: ["admin", "editor"]
          },
          {
            id: "chips",
            title: "Chips",
            type: "item",
            icon: <Icon.Circle size={10} />,
            navLink: "/extra-components/chips",
            userPermission: 1,
            permissions: ["admin", "editor"]
          },
          {
            id: "divider",
            title: "Divider",
            type: "item",
            icon: <Icon.Circle size={10} />,
            navLink: "/extra-components/divider",
            userPermission: 1,
            permissions: ["admin", "editor"]
          }
        ]
      },
      {
        id: "extensions",
        title: "Extensions",
        type: "dropdown",
        icon: <Icon.PlusCircle size={16} />,
        children: [
          {
            id: "sweetAlertExt",
            title: "Sweet Alerts",
            icon: <Icon.AlertCircle size={16} />,
            type: "item",
            navLink: "/extensions/sweet-alert",
            userPermission: 1,
            permissions: ["admin", "editor"]
          },
          {
            id: "toastrExt",
            title: "Toastr",
            icon: <Icon.Zap size={16} />,
            type: "item",
            navLink: "/extensions/toastr",
            userPermission: 1,
            permissions: ["admin", "editor"]
          },
          {
            id: "rcSlider",
            title: "Rc Slider",
            icon: <Icon.Sliders size={16} />,
            type: "item",
            navLink: "/extensions/slider",
            userPermission: 1,
            permissions: ["admin", "editor"]
          },
          {
            id: "fileUploader",
            title: "File Uploader",
            icon: <Icon.UploadCloud size={16} />,
            type: "item",
            navLink: "/extensions/file-uploader",
            userPermission: 1,
            permissions: ["admin", "editor"]
          },
          {
            id: "wysiwygEditor",
            title: "Wysiwyg Editor",
            icon: <Icon.Edit size={16} />,
            type: "item",
            navLink: "/extensions/wysiwyg-editor",
            userPermission: 1,
            permissions: ["admin", "editor"]
          },
          {
            id: "drag_&_drop",
            title: "Drag & Drop",
            icon: <Icon.Droplet size={16} />,
            type: "item",
            navLink: "/extensions/drag-and-drop",
            userPermission: 1,
            permissions: ["admin", "editor"]
          },
          {
            id: "tour",
            title: "Tour",
            icon: <Icon.Info size={16} />,
            type: "item",
            navLink: "/extensions/tour",
            userPermission: 1,
            permissions: ["admin", "editor"]
          },
          {
            id: "clipBoard",
            title: "Clipboard",
            icon: <Icon.Copy size={16} />,
            type: "item",
            navLink: "/extensions/clipboard",
            userPermission: 1,
            permissions: ["admin", "editor"]
          },
          {
            id: "contextMenu",
            title: "Context Menu",
            icon: <Icon.Menu size={16} />,
            type: "item",
            navLink: "/extensions/context-menu",
            userPermission: 1,
            permissions: ["admin", "editor"]
          },
          {
            id: "swiper",
            title: "Swiper",
            icon: <Icon.Smartphone size={16} />,
            type: "item",
            navLink: "/extensions/swiper",
            userPermission: 1,
            permissions: ["admin", "editor"]
          },
          {
            id: "access-control",
            title: "Access Control",
            icon: <Icon.Lock size={20} />,
            type: "item",
            navLink: "/extensions/access-control",
            userPermission: 1,
            permissions: ["admin", "editor"]
          },
          {
            id: "i18n",
            title: "I18n",
            icon: <Icon.Globe size={16} />,
            type: "item",
            navLink: "/extensions/i18n",
            userPermission: 1,
            permissions: ["admin", "editor"]
          },
          {
            id: "treeView",
            title: "Tree",
            icon: <Icon.GitPullRequest size={16} />,
            type: "item",
            navLink: "/extensions/tree",
            userPermission: 1,
            permissions: ["admin", "editor"]
          },
          {
            id: "extPagination",
            title: "Pagination",
            icon: <Icon.MoreHorizontal size={16} />,
            type: "item",
            navLink: "/extensions/pagination",
            userPermission: 1,
            permissions: ["admin", "editor"]
          },
          {
            id: "extImport",
            title: "Import",
            icon: <Icon.DownloadCloud size={16} />,
            type: "item",
            navLink: "/extensions/import",
            userPermission: 1,
            permissions: ["admin", "editor"]
          },
          {
            id: "extExport",
            title: "Export",
            icon: <Icon.UploadCloud size={16} />,
            type: "item",
            navLink: "/extensions/export",
            userPermission: 1,
            permissions: ["admin", "editor"]
          },
          {
            id: "extExportSelected",
            title: "Export Selected",
            icon: <Icon.CheckSquare size={16} />,
            type: "item",
            navLink: "/extensions/export-selected",
            userPermission: 1,
            permissions: ["admin", "editor"]
          }
        ]
      }
    ]
  },
  {
    id: "forms-tables",
    title: "Forms & Tables",
    type: "dropdown",
    icon: <Icon.Edit3 size={16} />,
    children: [
      {
        id: "formElements",
        title: "Form Elements",
        type: "dropdown",
        icon: <Icon.Copy size={16} />,
        children: [
          {
            id: "select",
            title: "Select",
            type: "item",
            icon: <Icon.Circle size={10} />,
            navLink: "/forms/elements/select",
            userPermission: 1,
            permissions: ["admin", "editor"]
          },
          {
            id: "switch",
            title: "Switch",
            type: "item",
            icon: <Icon.Circle size={10} />,
            navLink: "/forms/elements/switch",
            userPermission: 1,
            permissions: ["admin", "editor"]
          },
          {
            id: "checkbox",
            title: "Checkbox",
            type: "item",
            icon: <Icon.Circle size={10} />,
            navLink: "/forms/elements/checkbox",
            userPermission: 1,
            permissions: ["admin", "editor"]
          },
          {
            id: "radio",
            title: "Radio",
            type: "item",
            icon: <Icon.Circle size={10} />,
            navLink: "/forms/elements/radio",
            userPermission: 1,
            permissions: ["admin", "editor"]
          },
          {
            id: "input",
            title: "Input",
            type: "item",
            icon: <Icon.Circle size={10} />,
            navLink: "/forms/elements/input",
            userPermission: 1,
            permissions: ["admin", "editor"]
          },
          {
            id: "inputGroup",
            title: "Input Group",
            type: "item",
            icon: <Icon.Circle size={10} />,
            navLink: "/forms/elements/input-group",
            userPermission: 1,
            permissions: ["admin", "editor"]
          },
          {
            id: "numberInput",
            title: "Number Input",
            type: "item",
            icon: <Icon.Circle size={10} />,
            navLink: "/forms/elements/number-input",
            userPermission: 1,
            permissions: ["admin", "editor"]
          },
          {
            id: "textarea",
            title: "Textarea",
            type: "item",
            icon: <Icon.Circle size={10} />,
            navLink: "/forms/elements/textarea",
            userPermission: 1,
            permissions: ["admin", "editor"]
          },
          {
            id: "date_&_timePicker",
            title: "Date & Time Picker",
            type: "item",
            icon: <Icon.Circle size={10} />,
            navLink: "/forms/elements/pickers",
            userPermission: 1,
            permissions: ["admin", "editor"]
          },
          {
            id: "inputMask",
            title: "Input Mask",
            type: "item",
            icon: <Icon.Circle size={10} />,
            navLink: "/forms/elements/input-mask",
            userPermission: 1,
            permissions: ["admin", "editor"]
          }
        ]
      },
      {
        id: "formLayouts",
        title: "Form Layouts",
        type: "item",
        icon: <Icon.Box size={16} />,
        navLink: "/forms/layout/form-layout",
        userPermission: 1,
        permissions: ["admin", "editor"]
      },
      {
        id: "wizard",
        title: "Form Wizard",
        type: "item",
        icon: <Icon.MoreHorizontal size={16} />,
        navLink: "/forms/wizard",
        userPermission: 1,
        permissions: ["admin", "editor"]
      },
      {
        id: "formik",
        title: "Formik",
        type: "item",
        icon: <Icon.CheckCircle size={16} />,
        navLink: "/forms/formik",
        userPermission: 1,
        permissions: ["admin", "editor"]
      },
      {
        id: "tables",
        title: "Tables",
        type: "dropdown",
        icon: <Icon.Server size={16} />,
        children: [
          {
            id: "tablesReactstrap",
            title: "Reactstrap Tables",
            type: "item",
            icon: <Icon.Circle size={10} />,
            navLink: "/tables/reactstrap",
            userPermission: 1,
            permissions: ["admin", "editor"]
          },
          {
            id: "reactTables",
            title: "React Tables",
            type: "item",
            icon: <Icon.Circle size={10} />,
            navLink: "/tables/react-tables",
            userPermission: 1,
            permissions: ["admin", "editor"]
          },
          {
            id: "aggrid",
            title: "agGrid Table",
            type: "item",
            icon: <Icon.Circle size={10} />,
            navLink: "/tables/agGrid",
            userPermission: 1,
            permissions: ["admin", "editor"]
          },
          {
            id: "dataTable",
            title: "DataTables",
            type: "item",
            icon: <Icon.Circle size={12} />,
            userPermission: 1,
            permissions: ["admin", "editor"],
            navLink: "/tables/data-tables"
          }
        ]
      }
    ]
  },
  {
    id: "pages",
    title: "Pages",
    type: "dropdown",
    icon: <Icon.File size={16} />,
    children: [
      {
        id: "profile",
        title: "Profile",
        type: "item",
        icon: <Icon.User size={16} />,
        navLink: "/pages/profile",
        userPermission: 1,
        permissions: ["admin", "editor"]
      },
      {
        id: "accountSettings",
        title: "Account Settings",
        type: "item",
        icon: <Icon.Settings size={16} />,
        navLink: "/pages/account-settings",
        userPermission: 1,
        permissions: ["admin", "editor"]
      },
      {
        id: "faq",
        title: "FAQ",
        type: "item",
        icon: <Icon.HelpCircle size={16} />,
        navLink: "/pages/faq",
        userPermission: 1,
        permissions: ["admin", "editor"]
      },
      {
        id: "knowledgeBase",
        title: "Knowledge Base",
        type: "item",
        icon: <Icon.Info size={16} />,
        navLink: "/pages/knowledge-base",
        userPermission: 1,
        permissions: ["admin", "editor"],
        parentOf: [
          "/pages/knowledge-base/category/questions",
          "/pages/knowledge-base/category"
        ]
      },
      {
        id: "search",
        title: "Search",
        type: "item",
        icon: <Icon.Search size={16} />,
        navLink: "/pages/search",
        userPermission: 1,
        permissions: ["admin", "editor"]
      },
      {
        id: "invoice",
        title: "Invoice",
        type: "item",
        icon: <Icon.File size={16} />,
        navLink: "/pages/invoice",
        userPermission: 1,
        permissions: ["admin", "editor"]
      },
      {
        id: "authentication",
        title: "Authentication",
        type: "dropdown",
        icon: <Icon.Unlock size={16} />,
        children: [
          {
            id: "login",
            title: "Login",
            type: "item",
            icon: <Icon.Circle size={10} />,
            navLink: "/pages/login",
            userPermission: 1,
            permissions: ["admin", "editor"]
          },
          {
            id: "register",
            title: "Register",
            type: "item",
            icon: <Icon.Circle size={10} />,
            navLink: "/pages/register",
            userPermission: 1,
            permissions: ["admin", "editor"]
          },
          {
            id: "forgotPassword",
            title: "Forgot Password",
            type: "item",
            icon: <Icon.Circle size={10} />,
            navLink: "/pages/forgot-password",
            userPermission: 1,
            permissions: ["admin", "editor"]
          },
          {
            id: "resetPassword",
            title: "Reset Password",
            type: "item",
            icon: <Icon.Circle size={10} />,
            navLink: "/pages/reset-password",
            userPermission: 1,
            permissions: ["admin", "editor"]
          },
          {
            id: "lockScreen",
            title: "Lock Screen",
            type: "item",
            icon: <Icon.Circle size={10} />,
            navLink: "/pages/lock-screen",
            userPermission: 1,
            permissions: ["admin", "editor"]
          }
        ]
      },
      {
        id: "miscellaneous",
        title: "Miscellaneous",
        type: "dropdown",
        icon: <Icon.FileText size={16} />,
        children: [
          {
            id: "comingSoon",
            title: "Coming Soon",
            type: "item",
            icon: <Icon.Circle size={10} />,
            navLink: "/misc/coming-soon",
            userPermission: 1,
            permissions: ["admin", "editor"]
          },
          {
            id: "error",
            title: "Error",
            type: "dropdown",
            icon: <Icon.Circle size={10} />,
            children: [
              {
                id: "404",
                title: "404",
                type: "item",
                icon: <Icon.Circle size={10} />,
                navLink: "/misc/error/404",
                userPermission: 1,
                permissions: ["admin", "editor"]
              },
              {
                id: "500",
                title: "500",
                type: "item",
                icon: <Icon.Circle size={10} />,
                navLink: "/misc/error/500",
                userPermission: 1,
                permissions: ["admin", "editor"]
              }
            ]
          },
          {
            id: "notAuthorized",
            title: "Not Authorized",
            type: "item",
            icon: <Icon.Circle size={10} />,
            navLink: "/misc/not-authorized",
            userPermission: 1,
            permissions: ["admin", "editor"]
          },
          {
            id: "maintenance",
            title: "Maintenance",
            type: "item",
            icon: <Icon.Circle size={10} />,
            navLink: "/misc/maintenance",
            userPermission: 1,
            permissions: ["admin", "editor"]
          }
        ]
      }
    ]
  },
  {
    id: "charts-maps",
    title: "Charts & Maps",
    type: "dropdown",
    icon: <Icon.BarChart2 size={16} />,
    children: [
      {
        id: "charts",
        title: "Charts",
        type: "dropdown",
        badge: "success",
        badgeText: "3",
        icon: <Icon.PieChart size={16} />,
        children: [
          {
            id: "apex",
            title: "Apex",
            type: "item",
            icon: <Icon.Circle size={10} />,
            navLink: "/charts/apex",
            userPermission: 1,
            permissions: ["admin", "editor"]
          },
          {
            id: "chartJs",
            title: "ChartJS",
            type: "item",
            icon: <Icon.Circle size={10} />,
            navLink: "/charts/chartjs",
            userPermission: 1,
            permissions: ["admin", "editor"]
          },
          {
            id: "recharts",
            title: "Recharts",
            type: "item",
            icon: <Icon.Circle size={10} />,
            navLink: "/charts/recharts",
            userPermission: 1,
            permissions: ["admin", "editor"]
          }
        ]
      },
      {
        id: "leafletMaps",
        title: "Leaflet Maps",
        icon: <Icon.Map size={16} />,
        type: "item",
        navLink: "/maps/leaflet",
        userPermission: 1,
        permissions: ["admin", "editor"]
      }
    ]
  },
  {
    id: "others",
    title: "Others",
    type: "dropdown",
    icon: <Icon.MoreHorizontal size={16} />,
    children: [
      {
        id: "menuLevels",
        title: "Menu Levels",
        icon: <Icon.Menu size={16} />,
        type: "dropdown",
        children: [
          {
            id: "secondLevel",
            title: "Second Level",
            icon: <Icon.Circle size={10} />,
            type: "item",
            navlink: "",
            userPermission: 1,
            permissions: ["admin", "editor"]
          },
          {
            id: "secondLevel1",
            title: "Second Level",
            icon: <Icon.Circle size={10} />,
            type: "dropdown",
            children: [
              {
                id: "ThirdLevel",
                title: "Third Level",
                icon: <Icon.Circle size={10} />,
                type: "item",
                navLink: "",
                userPermission: 1,
                permissions: ["admin", "editor"]
              },
              {
                id: "ThirdLevel1",
                title: "Third Level",
                icon: <Icon.Circle size={10} />,
                type: "item",
                navLink: "",
                userPermission: 1,
                permissions: ["admin", "editor"]
              }
            ]
          }
        ]
      },
      {
        id: "disabledMenu",
        title: "Disabled Menu",
        icon: <Icon.EyeOff size={16} />,
        type: "item",
        navLink: "#",
        userPermission: 1,
        permissions: ["admin", "editor"],
        disabled: true
      },
      {
        id: "documentation",
        title: "Documentation",
        icon: <Icon.Folder size={16} />,
        type: "external-link",
        navLink: "google.com",
        userPermission: 1,
        permissions: ["admin", "editor"]
      },
      {
        id: "raiseSupport",
        title: "Raise Support",
        icon: <Icon.LifeBuoy size={16} />,
        type: "external-link",
        newTab: true,
        navLink: "https://pixinvent.ticksy.com/",
        userPermission: 1,
        permissions: ["admin", "editor"]
      }
    ]
  }
]

export default horizontalMenuConfig
