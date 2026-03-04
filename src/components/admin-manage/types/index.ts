import { Component } from 'vue'

export enum AdminSidebarItemKey {
  User = 'user',
  System = 'system'
}

export interface AdminSidebarItem {
  key: AdminSidebarItemKey
  title: string
  icon?: Component
}
