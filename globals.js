export const vertexElements = 5;
export const vertexSize = vertexElements*4; //float are 4 bytes
export const vertexsPerEntity = 6;
export const entitySize = vertexSize*vertexsPerEntity;
export const elementsPerEntity = vertexElements*vertexsPerEntity;
export const entitiesPerBuffer = 1000;
export const vertexBufferSize = entitySize*entitiesPerBuffer;
