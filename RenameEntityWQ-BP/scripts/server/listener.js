const system = server.registerSystem(0, 0);

let lines = [];

let lineEntity;

system.update = () => {
    if (lineEntity) {

        const { name } = system.getComponent(lineEntity, 'minecraft:nameable').data;

        if (name.length > 0) {
            lines.push(name);
            system.executeCommand(`/tellraw @a {"rawtext":[{"text":"§bRenameEntity>§r Added line \\"${name.replace('"', '\\"')}§r\\""}]}`, () => null);
        } else {
            system.executeCommand('/tellraw @a {"rawtext":[{"text":"§bRenameEntity>§r Please rename the name tag before using it!"}]}', () => null);
            system.executeCommand('/give @a anvil', () => null);
        }

        system.destroyEntity(lineEntity);

        lineEntity = null;

    }
};

system.listenForEvent('minecraft:entity_created', event => {
    const { entity } = event.data;

    if (entity.__identifier__ === 'renameentitywq:add_line') {

        // Mark this entity as a entity we need to check the name of the next update.
        lineEntity = entity;

    } else if (lines.length > 0) {

        // Apply lines to entity name.
        const nameComponent = system.getComponent(entity, 'minecraft:nameable');
        nameComponent.data.name = lines.join('\n');
        system.applyComponentChanges(entity, nameComponent);
        system.executeCommand('/tellraw @a {"rawtext":[{"text":"§bRenameEntity>§r Successfully renamed entity!"}]}', () => null);
        lines = [];

    }
});