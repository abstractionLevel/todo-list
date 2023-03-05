import PouchDB from 'pouchdb';


const db = new PouchDB('tasks', { auto_compaction: true });

export const addTask = async (task) => {
    try {
        const response = await db.post({
            _id: new Date().toISOString(), // utilizza la data corrente come ID
            description: task.description,
            isDone: task.isDone,
            priority: task.priority
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

export const deleteTask = async (taskId) => {
    try {
        const task = await db.get(taskId);
        const response = await db.remove(task);
        return response;
    } catch (error) {
        console.log('Errore durante la cancellazione del task: ', error);
    }
};


export const getAllTasks = async () => {
    try {
        const result = await db.allDocs({ include_docs: true });
        const tasks = result.rows.map(row => row.doc);
        return tasks;
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