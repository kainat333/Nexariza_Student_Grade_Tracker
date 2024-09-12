import { BrowserRouter,Routes,Route } from "react-router-dom"
import GradeTracker from "../pages/gradetracker"
const AppRoutes = () => {
  return (
  <BrowserRouter>
  <Routes>
<Route path="/" element={<GradeTracker/>}/>
  </Routes>
  </BrowserRouter>
)
}

export default AppRoutes