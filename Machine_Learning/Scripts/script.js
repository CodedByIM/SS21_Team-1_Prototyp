
async function load_data(){
    const csvUrl = 'data.csv';
    const trainingData = tf.data.csv(csvUrl, {
        columnConfigs: {
            emotion: {
                isLabel: true
            }
        }
    });
    
const numOfFeatures = (await trainingData.columnNames()).length - 1;
const numOfSamples = 293;
const convertedData =
      trainingData.map(({xs, ys}) => {
              const labels = [
                    ys.emotion == "happy" ? 1 : 0,
                    ys.emotion == "afraid" ? 1 : 0
              ] 
              return{ xs: Object.values(xs), ys: Object.values(labels)};
          }).batch(10);
    
const model = tf.sequential();
model.add(tf.layers.dense({inputShape: [numOfFeatures], activation: "sigmoid", units: 5}))
model.add(tf.layers.dense({activation: "softmax", units: 2}));
    
model.compile({loss: "categoricalCrossentropy", optimizer: tf.train.adam(0.0001)});
    
await model.fitDataset(convertedData, 
                     {epochs:100,
                      callbacks:{
                          onEpochEnd: async(epoch, logs) =>{
                              console.log("Epoch: " + epoch + " Loss: " + logs.loss);
                          }
                      }});
    
// Happy
const testVal = tf.tensor2d([68, 102], [1, 2]);
    
// Afraid
//const testVal = tf.tensor2d([0, 0], [1, 2]);

// Virginica
// const testVal = tf.tensor2d([5.8,2.7,5.1,1.9], [1, 4]);
    
const prediction = model.predict(testVal);
const pIndex = tf.argMax(prediction, axis=1).dataSync();

await model.save('downloads://my-model');
    
const classNames = ["happy", "afraid"];
    
// alert(prediction)
alert(classNames[pIndex])
    
}
load_data();