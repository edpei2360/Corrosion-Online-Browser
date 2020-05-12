export const vertexSize = 4*3 + 2*2 + 4;//3 floats 2shorts 1 uint 
export const vertexsPerEntity = 4;
export const entitySize = vertexSize*vertexsPerEntity;
export const entitiesPerBuffer = 1000;
export const vertexBufferSize = entitySize*entitiesPerBuffer;
export const indexsPerEntity = 6;
