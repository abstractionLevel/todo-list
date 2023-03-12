import PouchDB from 'pouchdb';
import pouchFind from 'pouchdb-find';
PouchDB.plugin(pouchFind);

const db = new PouchDB('tasks', { auto_compaction: true });
const dbCatergory = new PouchDB('category', { auto_compaction: true });

dbCatergory.info().then((info) => {
    if (info.doc_count === 0) { // Verifica se il database è vuoto 
        dbCatergory.put({ // Inserisce il record di default
            _id: new Date().toISOString(),
            name: 'Global'
        }).then(() => {
            console.log('Record di default inserito con successo!');
        }).catch((error) => {
            console.error('Errore durante l\'inserimento del record di default:', error);
        });
    }
});

export const addTask = async (task) => {
    try {
        const response = await db.post({
            _id: new Date().toISOString(), // utilizza la data corrente come ID
            description: task.description,
            isDone: task.isDone,
            priority: task.priority,
            category_id: task.categoryId
        });
        return response;
    } catch (error) {
        console.log('Errore durante l\'inserimento del task: ', error);
    }
};

export const getTask = async (taskId) => {
    try {
        const response = await db.get(taskId);
        return response;
    } catch (error) {
        console.log('Errore durante la lettura del task: ', error);
    }
};

export const getTasksByPriorityAndCategoryId = async (value,categoryId) => {
    try {
        const response = await db.find({
            selector: { priority: value },
        })
        const filteredTasks  = response.docs.filter(task=>task.category_id===categoryId);
        return filteredTasks;
    } catch (error) {
        console.log('Errore durante la lettura del task: ', error);
    }

}

export const deleteTask = async (taskId) => {
    try {
        const task = await db.get(taskId);
        const response = await db.remove(task);
        return response;
    } catch (error) {
        console.log('Errore durante la cancellazione del task: ', error);
    }
};


export const getAllTasks = async (categoryId) => {
    try {
        const result = await db.allDocs({ include_docs: true });
        const tasks = result.rows.map(row => row.doc);
        const filteredTasks = tasks.filter(task => task.category_id === categoryId);
        const sortedTasks = filteredTasks.sort((a, b) => a.isDone - b.isDone);
        return sortedTasks;
    } catch (error) {
        console.log('Errore durante il recupero dei task: ', error);
    }
};


export const modifyTask = async (task) => {
    try {
        const response = await db.put(task);
        return response;
    } catch (error) {
        console.log('Errore durante l\'inserimento del task: ', error);
    }
};


export const removeTaskById = async (id) => {
    db.get(id)
        .then(resp => {
            if (resp) {
                return db.remove(resp)
            }
        })
        .catch(error => console.log("error: ", error))
}

export const addCategory = async (payload) => {
    try {
        const response = await dbCatergory.put({
            _id: new Date().toISOString(), // utilizza la data corrente come ID
            name: payload.name,

        });
        return response;
    } catch (error) {
        console.log('Errore durante l\'inserimento del task: ', error);
    }
};

export const getAllCategories = async () => {
    try {
        const response = await dbCatergory.allDocs({ include_docs: true });
        const categories = response.rows.map(val => val.doc);
        return categories;
    } catch (error) {
        console.log('Errore durante il recupero dei task: ', error);
    }
};