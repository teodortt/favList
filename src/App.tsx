import './App.css';
import { useEffect, useState } from 'react';
import { Input, Modal } from 'antd';

function App() {
  const storageName = localStorage.getItem('username');
  const storageFavPlayer = localStorage.getItem('favoritePlayer');
  const storageFavTeam = localStorage.getItem('favoriteTeam');

  const initialUserData = {
    username: storageName || '',
    favoritePlayer: storageFavPlayer || '',
    favoriteTeam: storageFavTeam || '',
  };

  const [data, setData] = useState<any>();
  const [isHoveredPlayer, setIsHoveredPlayer] = useState(false);
  const [isHoveredTeam, setIsHoveredTeam] = useState(false);

  const [userData, setUserData] = useState(initialUserData);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
    localStorage.setItem('username', userData.username);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleChange = (key: string, value: string) => {
    setUserData({ ...userData, [key]: value });
  };

  const handleFavorite = (key: string, value: string) => {
    setUserData({ ...userData, [key]: value });
    localStorage.setItem(key, value);
  };

  async function getData(url: string) {
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();
      console.log(result.data);
      return result.data;
    } catch (error) {
      console.error('Error:', error);
    }
  }
  useEffect(() => {
    Promise.all([
      getData('https://www.balldontlie.io/api/v1/players'),
      getData('https://www.balldontlie.io/api/v1/teams'),
    ]).then((data) => setData(data));
  }, []);

  const players = data && data.length > 0 && data[0];
  const teams = data && data.length > 0 && data[1];

  return (
    <div>
      <div className='welcomeText' onClick={showModal}>
        {!storageName ? (
          <span>
            Hello, click here and set your username to can add favorites
          </span>
        ) : (
          <span>Hello {storageName}</span>
        )}
        {storageName && storageFavPlayer && (
          <p>your favorite player is {storageFavPlayer}</p>
        )}
        {storageName && storageFavTeam && (
          <p>your favorite team is {storageFavTeam}</p>
        )}
      </div>
      <div style={{ display: 'flex', gap: 50 }}>
        <div>
          Top NBA players
          <table
            className='table'
            onMouseEnter={() => storageName && setIsHoveredPlayer(true)}
            onMouseLeave={() => setIsHoveredPlayer(false)}
          >
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Position</th>
                <th>Team</th>
              </tr>
            </thead>
            <tbody>
              {players?.map((item: any) => (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td>
                    {item.first_name} {item.last_name}
                  </td>
                  <td>
                    {!isHoveredPlayer ? (
                      <span className='position'>{item.position}</span>
                    ) : (
                      <span
                        className='addFavorite'
                        onClick={() =>
                          !storageFavPlayer
                            ? handleFavorite(
                                'favoritePlayer',
                                item.first_name + item.last_name
                              )
                            : handleFavorite('favoritePlayer', '')
                        }
                      >
                        {!storageFavPlayer ? 'Add to favorites' : 'Remove'}
                      </span>
                    )}
                  </td>
                  <td>{item.team.full_name}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div>
          Top NBA teams
          <table
            className='table'
            onMouseEnter={() => storageName && setIsHoveredTeam(true)}
            onMouseLeave={() => setIsHoveredTeam(false)}
          >
            <thead>
              <tr>
                <th>City</th>
                <th>Team</th>
                <th>Conference</th>
                <th>Division</th>
              </tr>
            </thead>
            <tbody>
              {teams?.map((item: any) => (
                <tr key={item.id}>
                  <td>{item.city}</td>
                  <td>{item.full_name}</td>
                  <td>
                    {!isHoveredTeam ? (
                      <span className='position'>{item.conference}</span>
                    ) : (
                      <span
                        className='addFavorite'
                        onClick={() =>
                          !storageFavTeam
                            ? handleFavorite('favoriteTeam', item.full_name)
                            : handleFavorite('favoriteTeam', '')
                        }
                      >
                        {!storageFavTeam ? 'Add to favorites' : 'Remove'}
                      </span>
                    )}
                  </td>
                  <td>{item.division}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <Modal
        title='Set your username'
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Input
          className='inputField'
          placeholder='Place here your username'
          value={userData.username}
          onChange={(e) => handleChange('username', e.target.value)}
        />
      </Modal>
    </div>
  );
}

export default App;
