# 身份认证失败页面 - 实现计划

## [ ] Task 1: 创建认证失败页面组件
- **Priority**: P0
- **Depends On**: None
- **Description**: 
  - 创建 `/src/views/401.vue` 页面组件
  - 参考现有 404 页面的结构
  - 实现认证失败的错误信息和重新登录按钮
- **Acceptance Criteria Addressed**: AC-1, AC-3
- **Test Requirements**:
  - `human-judgement` TR-1.1: 页面布局合理，错误信息清晰
  - `human-judgement` TR-1.2: 重新登录按钮功能正常
- **Notes**: 保持与现有 404 页面的风格一致

## [ ] Task 2: 添加认证失败页面的路由配置
- **Priority**: P0
- **Depends On**: Task 1
- **Description**: 
  - 在 `static-routes.ts` 中添加 /401 路由
  - 配置路由元信息
- **Acceptance Criteria Addressed**: AC-4
- **Test Requirements**:
  - `programmatic` TR-2.1: 访问 /401 路径显示认证失败页面
- **Notes**: 参考现有 404 路由的配置方式

## [ ] Task 3: 修改响应拦截器处理 401 错误
- **Priority**: P0
- **Depends On**: Task 2
- **Description**: 
  - 在 `request.ts` 的响应拦截器中检测 401 错误
  - 当检测到 401 错误时，跳转到 /401 页面
  - 清除用户的认证状态
- **Acceptance Criteria Addressed**: AC-2
- **Test Requirements**:
  - `programmatic` TR-3.1: 后端返回 401 时自动跳转到 /401 页面
  - `programmatic` TR-3.2: 跳转到 /401 页面后清除用户认证状态
- **Notes**: 确保只在 401 错误时跳转，其他错误保持原有处理方式

## [ ] Task 4: 测试和验证
- **Priority**: P1
- **Depends On**: Task 1, Task 2, Task 3
- **Description**: 
  - 模拟 401 错误场景
  - 验证自动跳转到认证失败页面
  - 测试重新登录功能
- **Acceptance Criteria Addressed**: AC-1, AC-2, AC-3, AC-4
- **Test Requirements**:
  - `programmatic` TR-4.1: 所有功能正常工作
  - `human-judgement` TR-4.2: 用户体验良好
- **Notes**: 可以通过修改请求拦截器中的 token 来模拟认证失败