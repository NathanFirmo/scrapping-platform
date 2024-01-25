import React, { useEffect, useState } from 'react'
import { DesktopOutlined, PieChartOutlined } from '@ant-design/icons'
import { Layout, Menu } from 'antd'
import Title from 'antd/es/typography/Title'
import InfiniteList from './components/InfiniteList'
import { Warning, WorkerConfig } from './components'
const { Content, Footer, Sider } = Layout

const App: React.FC = () => {
  const [page, setPage] = useState('dashboard')
  const [workerStatus, setWorkerStatus] = useState('ONLINE')
  const [webSocketConnection, setWebSocketConnection] = useState('OPEN')
  let ws = new WebSocket(import.meta.env.VITE_WEBSOCKET_URL)

  const onWebSocketMessage = (e: MessageEvent<any>) => {
    const payload = JSON.parse(e.data)
    if (payload.data === 'ONLINE') {
      setWorkerStatus('ONLINE')
    } else if (payload.data === 'OFFLINE') {
      setWorkerStatus('OFFLINE')
    }
  }

  const onWebSocketClose = () => {
    setWebSocketConnection('CLOSED')
  }

  ws.onmessage = onWebSocketMessage
  ws.onclose = onWebSocketClose

  useEffect(() => {
    fetch(String(import.meta.env.VITE_API_URL) + '/status')
      .then((res) => res.json())
      .then((body) => {
        setWorkerStatus(body.status)
      })
  }, [])

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
        {webSocketConnection === 'CLOSED' ? (
          <Warning text="A conexão com o servidor foi perdida" />
        ) : null}
        {workerStatus === 'OFFLINE' ? (
          <Warning text="O Worker está OFFLINE" />
        ) : null}
        <Content style={{ margin: '0 16px' }}>
          {page === 'dashboard' ? (
            <>
              <Title>Dados do Scraping 🗂️</Title>
              <InfiniteList
                title="title"
                description="description"
                url={
                  String(import.meta.env.VITE_API_URL) + '/scrapping-data'
                }
              />
              <Title>Execuções do worker 🤖</Title>
              <InfiniteList
                title="date"
                description="keyword"
                url={String(import.meta.env.VITE_API_URL) + '/runs'}
              />
            </>
          ) : (
            <WorkerConfig
              url={String(import.meta.env.VITE_API_URL) + '/config'}
              ws={ws}
            />
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
