import {
  ElButton,
  ElForm,
  ElFormItem,
  ElInput,
  ElMessage,
  ElContainer,
  ElHeader,
  ElAside,
  ElMain,
  ElMenu,
  ElSubmenu,
  ElMenuItemGroup,
  ElMenuItem,
  ElBreadcrumb,
  ElBreadcrumbItem,
  ElCard,
  ElRow,
  ElCol,
  ElTable,
  ElTableColumn,
  ElSwitch, ElTooltip, ElPagination, ElDialog, ElMessageBox
} from 'element-plus'
import lang from 'element-plus/lib/locale/lang/zh-cn'
import locale from 'element-plus/lib/locale'

export default (app) => {
  locale.use(lang)
  app.use(ElButton)
    .use(ElFormItem)
    .use(ElForm)
    .use(ElInput)
    .use(ElContainer)
    .use(ElHeader)
    .use(ElAside)
    .use(ElMain)
    .use(ElMenu)
    .use(ElSubmenu)
    .use(ElMenuItemGroup)
    .use(ElMenuItem)
    .use(ElBreadcrumb)
    .use(ElBreadcrumbItem)
    .use(ElCard)
    .use(ElRow)
    .use(ElCol)
    .use(ElTable)
    .use(ElTableColumn)
    .use(ElSwitch)
    .use(ElTooltip)
    .use(ElPagination)
    .use(ElDialog)
    .use(ElMessageBox)
  app.config.globalProperties.$message = ElMessage
}
