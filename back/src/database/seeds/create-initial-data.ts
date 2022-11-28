import { Seeder /*, SeederFactoryManager */ } from 'typeorm-extension';
import { DataSource } from 'typeorm';

import { Channels } from '../../entities/Channels';
import { Workspaces } from '../../entities/Workspaces';

export default class UserSeeder implements Seeder {
  public async run(
    dataSource: DataSource,
    // factoryManager: SeederFactoryManager,
  ): Promise<any> {
    const workspacesRepository = dataSource.getRepository(Workspaces);
    await workspacesRepository.insert([
      {
        id: 1,
        name: 'My Workspace',
        url: 'caleb.barrows@gmail.com',
      },
    ]);

    const channelsRepository = dataSource.getRepository(Channels);
    await channelsRepository.insert([
      {
        id: 1,
        name: '일반',
        WorkspaceId: 1,
        private: false,
      },
    ]);

    // factoryManager 는 faker 와 함께 사용시 유용
    // ---------------------------------------------------

    // const userFactory = await factoryManager.get(User);
    // // save 1 factory generated entity, to the database
    // await userFactory.save();

    // // save 5 factory generated entities, to the database
    // await userFactory.saveMany(5);
  }
}
