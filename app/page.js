'use client'
import Image from "next/image";
import {useState, useEffect} from 'react'
import {fireStore} from '@/firebase'
import {Box, Typography, Stack, TextField, Modal, Button, Grid, Alert, Snackbar} from '@mui/material'
import { query, getDocs, collection, doc, setDoc, getDoc, deleteDoc} from "firebase/firestore";
import { getRecipe } from "./recipeApi";


export default function Home() {
  const [inventory, setInventory] = useState([])
  const[open, setOpen] = useState(false)
  const [itemName, setItemName] = useState('')
  const [addedAlert,setAddedAlert] = useState(false)
  const [removeAlert,setRemoveAlert] = useState(false)
  const[recipeList, setRecipeList] = useState([])
  const[currentRecipe, setCurrentRecipe] = useState({})
  const[currentPage, setCurrentPage] = useState(0)

  const upadateInventory = async () => {
    const snapshot = query(collection(fireStore,'inventory'))
    const docs = await getDocs(snapshot)
    const inventoryList = []
    docs.forEach((doc) => {
      inventoryList.push({
        name: doc.id,
        ...doc.data(),
      })
    })
    setInventory(inventoryList)
    console.log(inventoryList)
  }

  const removeItem = async (item) => {
    const docRef = doc(collection(fireStore, 'inventory'), item)
    const docSnap = await getDoc(docRef)

    if(docSnap.exists()){
      const {quantity} = docSnap.data()
      if (quantity === 1){
        await deleteDoc(docRef)
      }
      else{
        await setDoc(docRef, {quantity: quantity - 1})
      }
    }
    await upadateInventory()
    handleRemoveAlert()
  }

  const addItem = async (item) => {
    const docRef = doc(collection(fireStore, 'inventory'), item)
    const docSnap = await getDoc(docRef)

    if(docSnap.exists()){
      const {quantity} = docSnap.data()
      await setDoc(docRef, {quantity: quantity + 1})
    }
    else {
      await setDoc(docRef, {quantity: 1})
    }
    await upadateInventory()
    handleShowAlert()
  }

  const nextPage = () => {
    const newIndex = currentPage + 1
    console.log("Changing page to: ",newIndex)
    if(newIndex < recipeList.length){
      setCurrentPage(newIndex)
      updateCurrentRecipe(recipeList,currentPage)
    }
  }

  const prevPage = () => {
    const newIndex = currentPage - 1
    if(newIndex >= 0){
      console.log("Changing page to: ",newIndex)
      setCurrentPage(newIndex)
      updateCurrentRecipe(recipeList,newIndex)
    }
  }

  const updateCurrentRecipe = (data,index) => {
    console.log("Updating current recipes...")
    if(index >= 0 && index < data.length){
      const recipe = data[index]
      const title = recipe.title
      const ingredients = recipe.ingredients.split("|")
      const servings = recipe.servings
      const instructions = recipe.instructions.split(". ")
      setCurrentRecipe({title,ingredients,servings,instructions})
    }
  }

  const getRecipeList = async (query) => {
    try{
      const data = await getRecipe(query)
      setRecipeList(data)

      if(data.length > 0){
        console.log("set the recipe list: ",recipeList) 
        updateCurrentRecipe(data,0)
      }
    } catch(error){
      console.error('Error fetching recipe: ',error)
    }
  }

  useEffect(() => {
    upadateInventory()
  },[])

  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)
  const handleShowAlert = () => setAddedAlert(true)
  const handleHideAlert = () => setAddedAlert(false)
  const handleRemoveAlert = () => setRemoveAlert(true)
  const handleCloseAlert = () => setRemoveAlert(false)

  return(
    <Box 
      width = "100vw" 
      height= "100vh" 
      display = "flex" 
      flexDirection="column"
      justifyContent = "center" 
      alignItems = "center"
      gap={2}
    >
      <Snackbar
        display="flex"
        open={addedAlert}
        autoHideDuration={6000}
        onClose={handleHideAlert}
        anchorOrigin={{vertical:'top',horizontal:'center'}}
      >
        <Alert
          variant="filled"
          severity="success"
          onClose={handleHideAlert}
        >
          Successfully added item!
        </Alert>
      </Snackbar>

      <Snackbar
        display="flex"
        open={removeAlert}
        autoHideDuration={6000}
        onClose={handleRemoveAlert}
        anchorOrigin={{vertical:'top',horizontal:'center'}}
      >
        <Alert
          variant="filled"
          severity="success"
          onClose={handleCloseAlert}
        >
          Successfully removed item!
        </Alert>
      </Snackbar>
      

      <Modal
        open = {open}
        onClose = {handleClose}
      >
        <Box
          position = "absolute"
          top="50%"
          left="50%" 
          width={400}
          bgcolor="white"
          border="2px solid black"
          borderRadius={5}
          boxShadow={24}
          p={4}
          display="flex"
          flexDirection="column"
          gap={3} 
          sx = {{
            transform:"translate(-50%, -50%)"
          }}
        >

          <Typography 
            variant="h6"
          >
            Add Item
          </Typography>

          <Stack 
            width="100%" 
            direction = "row"
            spacing={2}
          >
            <TextField
              variant="outlined"
              fullWidth
              value={itemName}
              onChange={(e) => {
                setItemName(e.target.value)
              }}
            />
            <Button
              variant="outlined"
              onClick={()=>{
                addItem(itemName)
                setItemName('')
                handleClose()
              }}
            > 
              Add 
            </Button> 
          </Stack>
        </Box>
      </Modal>
      
      <Button
        variant="contained"
        onClick={() => {
          handleOpen()
        }}
      >
        Add New item
      </Button>

      <Box
        display="flex"
        width="100vw"
        p={4}
        gap={2}
      >
        <Box
          border="1px solid black"
          borderRadius={5}
        >
          <Box 
            width="800px"
            height="auto"
            bgcolor="#ADD8E6"
            sx = {{
              borderTopLeftRadius : 20,
              borderTopRightRadius : 20
            }}
            
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <Typography
              variant="h4"
              color="black"
            >
            Inventory Items 
            </Typography>
          </Box>
        
        
          <Stack 
            width='800px'
            height="60vh"
            spacing={2}
            overflow="auto"
          >
              {
                inventory.map(({name,quantity}) => (
                  <Grid
                    key={name}
                    width="100%"
                    maxHeight="10px"
                    display="flex"
                    alignItems="center"
                    justifyContent="space-between"
                    bgcolor="#f0f0f0"
                    padding={5}
                  >
                    <Grid
                      container 
                      spacing={2}
                      alignItems="center"
                    >
                      <Grid item xs={4}>
                        <Typography 
                          variant="h5"
                          color="#333"
                          textAlign="center"
                        >
                          {name.charAt(0).toUpperCase() + name.slice(1)}
                        </Typography>
                      </Grid>

                      <Grid item xs={4}>
                        <Typography 
                          variant="h5"
                          color="#333"
                          textAlign="center"
                        >
                          {quantity}
                        </Typography>
                      </Grid>
                      
                      <Grid item xs={4}>
                        <Stack
                        direction="row"
                        spacing={2}>
                          <Button
                            variant="contained"
                            onClick={() => {
                              addItem(name)
                              getRecipeList(name)
                            }}
                          >
                            Add
                          </Button>
                          <Button
                            variant="contained"
                            onClick={() => {
                              removeItem(name)
                            }}
                          >
                            Remove
                          </Button>
                        </Stack>
                      </Grid>
                    </Grid>
                    
                    
                  </Grid>
                ))
              }
            </Stack>
        </Box>
        <Stack
              width="800px"
            >
              <Box
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                border="1px solid black"
                sx = {{
                  borderTopLeftRadius : 20,
                  borderTopRightRadius : 20
                }}
                bgcolor="#f0f0f0"
                maxHeight="70vh"
              >
                <Typography
                  variant="h5"
                  textAlign="center"
                  bgcolor="#b0b0b0"
                  width="100%"
                  sx = {{
                    borderTopLeftRadius : 20,
                    borderTopRightRadius : 20
                  }}
                >
                  Recipe
                </Typography>

                {currentRecipe.title && (
                  <Stack overflow="auto">
                    <Typography variant="h6">{currentRecipe.title}</Typography>
                    <Typography variant="h8">ingredients</Typography>
                    <Stack spacing={1}>
                      {currentRecipe.ingredients.map((ingredients) => (
                        <Typography variant="h8">{ingredients}</Typography>
                      ))}
                    </Stack>
                    <Typography variant="h8">{currentRecipe.servings}</Typography>
                    <Typography variant="h6">Instructions:</Typography>
                    <Stack spacing={1}>
                      {currentRecipe.instructions.map((instruction) => (
                        <Typography variant="h8">{instruction}</Typography>
                      ))}
                    </Stack>
                    
                  </Stack>
                )}
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignContent="center"
                  width="100%"
                  marginLeft={2}
                  marginRight={2}
                >
                  <Button onClick={prevPage}>Prev</Button>
                  <Button onClick={nextPage}>Next</Button>
                </Box>
              </Box>

            </Stack>
      </Box>
      
    </Box>
  )
}
