import React, { useEffect, useState } from 'react'
import VirtualList from 'rc-virtual-list'
import { List } from 'antd'

const ContainerHeight = 400

interface InfiniteListProps {
  url: string
  title: string
  description: string
}

const InfiniteList: React.FC<InfiniteListProps> = ({
  description,
  title,
  url,
}: InfiniteListProps) => {
  const [data, setData] = useState<Array<Record<string, any>>>([])

  const appendData = () => {
    fetch(url)
      .then((res) => res.json())
      .then((body) => {
        setData(body)
      })
  }

  useEffect(() => {
    appendData()
  }, [])

  return (
    <List
      style={{
        padding: 16,
        boxShadow: '0px 0px 5px rgba(0, 0, 0, 0.3)',
        borderRadius: 8,
      }}
    >
      <VirtualList
        data={data}
        height={ContainerHeight}
        itemHeight={47}
        itemKey="title"
      >
        {(item: Record<string, any>) =>
          item ? (
            <List.Item>
              <List.Item.Meta
                title={item[title]}
                description={item[description]}
              />
            </List.Item>
          ) : (
            <></>
          )
        }
      </VirtualList>
    </List>
  )
}

export default InfiniteList
