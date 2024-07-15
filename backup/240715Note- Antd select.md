# 1. 如何局部修改 Antd Select组件 placeholder 的颜色
less，在子组件内部写 global 样式
```css

    :global {
      .ant-select-selection-placeholder {
        color: #0088f9;
      }
    }

```
# 2. 如何在 Antd Select 前面加一个图标？
将组件传入 placeholder
```js
  const TextWithIcon = ({ text, icon }: { icon: ReactNode; text: ReactNode }) => (
    <span className='flex items-center justify-start '>
      <span className='flex justify-center items-center'>{icon}</span>
      {text}
    </span>
  )

<Select placeholder={<TextWithIcon icon={<DownloadOutlined />} text='xxxx' />}

```
