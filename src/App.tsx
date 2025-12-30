import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { RecipeProvider } from './context/RecipeContext';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { AddRecipe } from './pages/AddRecipe';
import { RecipeDetail } from './pages/RecipeDetail';
import { EditRecipe } from './pages/EditRecipe';
import { DataMigration } from './components/DataMigration';

function App() {
  return (
    <RecipeProvider>
      <BrowserRouter>
        <DataMigration />
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="add" element={<AddRecipe />} />
            <Route path="edit/:id" element={<EditRecipe />} />
            <Route path="recipe/:id" element={<RecipeDetail />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </RecipeProvider>
  )
}

export default App
