export const getRecipe = async (query) => {
    try {
        const response = await fetch(`https://api.api-ninjas.com/v1/recipe?query=${query}`, {
            method : 'GET',
            headers : { 'X-Api-Key' : 'VTr7seJQ0ZQbA1fMenkABhJfrjXqtp00F7CLhV38'},
        });

        if(!response.ok){
            throw new Error(`Error ${response.status} ${response.statusText}`)
        }

        const data = await response.json();
        console.log('data fetched:',data)
        return data;
    } catch (error){
        console.error('Error while fetching:',error)
        throw error;
    }
}


