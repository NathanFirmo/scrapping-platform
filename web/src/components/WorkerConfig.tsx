import { ClockCircleFilled, ControlFilled } from '@ant-design/icons'
import { Button, Input, Typography } from 'antd'
import Title from 'antd/es/typography/Title'
import { useEffect, useState } from 'react'

interface WorkerConfigProps {
  url: string
  ws: WebSocket
}

export const WorkerConfig: React.FC<WorkerConfigProps> = ({
  url,
  ws,
}: WorkerConfigProps) => {
  const [cronExpression, setCronExpression] = useState('')
  const [key, setKey] = useState('')

  useEffect(() => {
    fetch(url)
      .then((res) => res.json())
      .then((body) => {
        setKey(body.keyword)
        setCronExpression(body.cronExpression)
      })
  }, [])

  return (
    <>
      <Title>Configurações do worker 🤖</Title>
      <div style={{ margin: '4px auto' }}>
        <Typography>Altere a palavra chave usada pelo web crawler (assim que você clicar em "Aplicar configurações" o worker irá relizar a busca)</Typography>
      </div>
      <Input
        style={{ margin: '8px auto' }}
        addonAfter={<ControlFilled />}
        value={key}
        onChange={(e) => {
          setKey(e.target.value)
        }}
      />
      <div style={{ margin: '4px auto' }}>
        <Typography>
          Altere o período padrão de execução do crawler usando uma{' '}
          <a
            href="https://www.ibm.com/docs/pt-br/urbancode-release/6.1.0?topic=interval-cron-expressions-defining-frequency"
            target="_blank"
          >
            expressão cron
          </a>
        </Typography>
      </div>
      <Input
        addonAfter={<ClockCircleFilled />}
        value={cronExpression}
        onChange={(e) => {
          setCronExpression(e.target.value)
        }}
      />

      <div style={{ display: 'flex' }}>
        <Button
          style={{ margin: '16px auto' }}
          type="primary"
          onClick={() => {
            ws.send(
              JSON.stringify({
                event: 'worker-config-change',
                data: {
                  cron: cronExpression,
                  keyword: key,
                },
              })
            )
          }}
        >
          Aplicar configurações
        </Button>
      </div>
    </>
  )
}
