import { ElButton, ElForm, ElFormItem, ElInput, ElMessage } from 'element-plus'
import lang from 'element-plus/lib/locale/lang/zh-cn'
import locale from 'element-plus/lib/locale'

export default (app) => {
  locale.use(lang)
  app.use(ElButton).use(ElFormItem).use(ElForm).use(ElInput)
  app.config.globalProperties.$message = ElMessage
}
