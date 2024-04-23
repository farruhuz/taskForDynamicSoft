// UserList.tsx
"use client"
import { useAddUserMutation, useDeleteUserMutation, useGetUsersQuery, useUpdateUserMutation } from '@/redux/slice/apiSlice';
import { useEffect, useState } from 'react';

const UserList = () => {

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(3);
  const [filter, setFilter] = useState('');

  const { data: users = [], isLoading, isError, refetch } = useGetUsersQuery({ page, limit, filter });
  const [name, setName] = useState('');
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');

  const [addUser] = useAddUserMutation();
  const [updateUser] = useUpdateUserMutation();
  const [deleteUser] = useDeleteUserMutation();

  const handleAddUser = async () => {
    await addUser({ name });
    setName('');
    refetch();
  };

  const handleUpdateUser = async () => {
    if (!updatingId) return;
    await updateUser({ id: updatingId, name: editingName });
    setUpdatingId(null);
    setEditingName('');
    refetch();
  };

  const handleDeleteUser = async (id: string) => {
    await deleteUser(id);
    refetch();
  };

  useEffect(() => {
    if (updatingId) {
      const userToUpdate = users.find((user) => user?.id === updatingId);
      if (userToUpdate) setEditingName(userToUpdate.name);
    }
  }, [updatingId, users]);

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error fetching data</div>;

  return (
    <>
      <div>
        <input
          type="text"
          placeholder="Filter by name"
          value={filter}
          onChange={(e) => {
            setFilter(e.target.value);
            setPage(1);
          }}
        />
        <select
          value={limit}
          onChange={(e) => {
            setLimit(Number(e.target.value));
            setPage(1);
          }}
        >
          <option value={3}>3 per page</option>
          <option value={5}>5 per page</option>
          <option value={10}>10 per page</option>
        </select>
      </div>

      <div className='flex pt-[20px] pb-[20px] w-full justify-end gap-[20px]'>
        <input
          className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
          placeholder="Add User"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <button className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded' onClick={handleAddUser}>+</button>
      </div>

      <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" className="px-6 py-3">
              Full Name
            </th>
            <th scope="col" className="px-6 py-3">
              pet
            </th>
            <th scope="col" className="px-6 py-3">
              image
            </th>
            <th scope="col" className="px-6 py-3">
              Edit
            </th>
            <th scope="col" className="px-6 py-3">
              Del
            </th>
          </tr>
        </thead>
        <tbody>
          {users?.map((user) => {
            return (
              <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                {updatingId === user.id
                  ? <th>
                    <input type="text" value={editingName} onChange={(e) => setEditingName(e.target.value)} />
                  </th>
                  : <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                    {user.name}
                  </th>
                }
                <td className="px-6 py-4">
                  {user.pet}
                </td>
                <td className="px-6 py-4">
                  <img src={user.avatar} alt="" />
                </td>
                {updatingId === user.id ? (
                  <>
                    <td className="px-6 py-4">
                      <button onClick={handleUpdateUser}>Update</button>
                    </td>
                    <td>
                      <button onClick={() => setUpdatingId(null)}>Cancel</button>
                    </td>
                  </>
                ) : (
                  <>
                    <td className="px-6 py-4">
                      <button onClick={() => setUpdatingId(user.id)}>Edit</button>
                    </td>
                    <td className="px-6 py-4">
                      <button onClick={() => handleDeleteUser(user.id)}>Delete</button>
                    </td>
                  </>
                )}
              </tr>
            )
          })}
        </tbody>
      </table>

      <div className='flex justify-between gap-2 mt-[10px]'>
        <button
          className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-l"
          disabled={page === 1} onClick={() => setPage((prevPage) => prevPage - 1)}
        >
          Prev
        </button>
        <button
          className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-r"
          disabled={users.length < limit}
          onClick={() => setPage((prevPage) => prevPage + 1)}
        >
          Next
        </button>
      </div>
    </>
  );
};

export default UserList;
