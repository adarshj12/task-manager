import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import Kanban from './components/Kanban'


function App() {

  return (
    <>
      <DndProvider backend={HTML5Backend}>
        <Kanban/>
      </DndProvider>

    </>
  )
}

export default App
