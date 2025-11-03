
interface Attachment {
  encrypt?: string;
  path: string;
  media_type: string;
}

interface Post {
  id: number; // from 1
  encrypt?: string;
  content: string;
  created_at: number; // timestamp
  attachments?: Attachment[];
}

const ExamplePosts: Array<Post> = [
  {
    id: 1,
    content: "Hello, World!",
    created_at: 1762162350939,
  },
  {
    id: 2,
    content: "A performant interface for rendering basic, flat lists, supporting the most handy features:",
    created_at: 1762162350939,
  },
  {
    id: 3,
    content: "它是一个纯组件（PureComponent），这意味着如果属性保持浅相等（shallow-equal），它将不会重新渲染。请确保 renderItem 函数所依赖的所有内容都作为属性（例如 extraData）传递，且更新后这些属性的值不相等（!==），否则 UI 可能不会随变化更新。这包括 data 属性和父组件状态。",
    created_at: 1762162350939,
  },{
    id: 4,
    content: "sparrow",
    attachments: [
      // {
      //   path: "20251103T173000-test-sparrow.jpg",
      //   media_type: "image/jpeg",
      // }
    ],
    created_at: 1762162362941,
  },
  {
    id: 5,
    content: "这个警告是浏览器关于事件监听器性能优化的提示，主要与滚动事件（这里是 wheel 事件）的处理有关。\n警告含义：\n当你给 wheel 事件（鼠标滚轮事件）添加监听器时，浏览器无法确定你的事件处理函数是否会调用 preventDefault() 来阻止默认滚动行为。为了确保滚动流畅，浏览器需要提前知道是否可以放心地进行滚动渲染，否则可能会因为等待事件处理而导致滚动卡顿。",
    created_at: 1762162350939,
  }
]

export type { Attachment, Post }

export {ExamplePosts}