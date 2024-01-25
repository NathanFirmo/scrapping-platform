'use client'
import React, { useEffect, useState } from 'react'
import { DesktopOutlined, PieChartOutlined } from '@ant-design/icons'
import { Divider, Empty, Layout, Menu } from 'antd'
import Title from 'antd/es/typography/Title'
import InfiniteList from './components/InfiniteList'
import { WorkerConfig } from './components'
const { Content, Footer, Sider } = Layout

const App: React.FC = () => {
  const [page, setPage] = useState('dashboard')
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider>
        <div className="demo-logo-vertical">
          <img
            height={30}
            src="https://assets-global.website-files.com/605b962d5e846a3de31701a8/6495de9d500d8383c085a8fb_brandmonitor-logo-dark.svg"
          />
        </div>
        <Menu
          theme="dark"
          defaultSelectedKeys={['dashboard']}
          mode="inline"
          onSelect={({ key }) => {
            setPage(key)
          }}
          items={[
            {
              label: 'Dashboard',
              key: 'dashboard',
              icon: <PieChartOutlined />,
            },
            {
              label: 'Configurações',
              key: 'worker-config',
              icon: <DesktopOutlined />,
            },
          ]}
        />
      </Sider>
      <Layout>
        <Content style={{ margin: '0 16px' }}>
          {page === 'dashboard' ? (
            <>
              <Title>Dados do Scraping 🗂️</Title>
              <InfiniteList
                title="title"
                description="description"
                url={
                  String(process.env.NEXT_PUBLIC_API_URL) + '/scrapping-data'
                }
              />
              <Title>Execuções do worker 🤖</Title>
              <InfiniteList
                title="date"
                description="keyword"
                url={String(process.env.NEXT_PUBLIC_API_URL) + '/runs'}
              />
            </>
          ) : (
            <WorkerConfig />
          )}
        </Content>
        <Footer style={{ textAlign: 'center' }}>
          Nathan Firmo © {new Date().getFullYear()}
        </Footer>
      </Layout>
    </Layout>
  )
}

export default App
