
async function myFirstTfjs() {
    const model = await tf.loadLayersModel('Model/my-model.json');
    console.log("Model loaded!");

    const testVal = tf.tensor2d([75, 82], [1, 2]);

    model.predict(testVal);

    const prediction = model.predict(testVal);
    const pIndex = tf.argMax(prediction, axis=1).dataSync();

    const classNames = ["happy", "afraid"];
    
    document.getElementById("emotion").innerHTML = classNames[pIndex];
    
}

myFirstTfjs();



