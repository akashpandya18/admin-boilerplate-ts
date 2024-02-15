'use client';

import Breadcrumb from '@/app/components/common/Breadcrumb';
import PrimaryButton from '../../common/Buttons/PrimaryButton';
import SecondaryButton from '../../common/Buttons/SecondaryButton';
import CommonInput from '../../common/Input/CommonInput';
import SelectMenu from '../../common/SelectMenu';

const UserComponent = ({
  pages,
  form,
  error,
  isView,
  MainStatus,
  propsAction,
  radioHandler,
  handleSubmit,
  handleChange,
  userGymType,
  selectedMenu,
  handleMenuChange,
}) => {
  return (
    <>
      <Breadcrumb pageList={pages} />
      <div className='mt-6'>
        <form onSubmit={handleSubmit}>
          <div className='flex flex-col items-start px-4 py-10 rounded-[10px] bg-white gap-4'>
            <div className='w-full md:max-w-4xl'>
              <div className='grid gap-4 sm:grid-cols-2 '>
                <CommonInput
                  id='first_name'
                  name='first_name'
                  type='text'
                  value={form.first_name}
                  onChange={handleChange}
                  label='First Name'
                  disabled={isView}
                  error={error.first_name}
                  // isRequired
                />
                <CommonInput
                  id='last_name'
                  name='last_name'
                  type='text'
                  value={form.last_name}
                  onChange={handleChange}
                  label='Last Name'
                  disabled={isView}
                  error={error.last_name}
                  // isRequired
                />
                <CommonInput
                  id='email'
                  name='email'
                  type='email'
                  value={form.email}
                  disabled={isView}
                  onChange={handleChange}
                  label='Email address'
                  error={error.email}
                  isRequired
                />
                {propsAction !== 'view' && (
                  <CommonInput
                    id='password'
                    name='password'
                    type='password'
                    value={form.password}
                    onChange={handleChange}
                    label='Password'
                    error={error.password}
                    autocomplete='new-password'
                    isIcon={true}
                    isRequired={propsAction === 'add' ? true : false}
                  />
                )}
                <div>
                  <SelectMenu
                    menuList={userGymType}
                    label={propsAction === 'view' ? 'Gym Name' : 'Select Gym'}
                    disabled={isView}
                    defaultSelected={selectedMenu}
                    setSelectedMenu={handleMenuChange}
                  />
                  <span className='text-xs text-red-400 error'>
                    {error.selectedMenu}
                  </span>
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700'>
                    Status
                  </label>
                  <fieldset className='mt-4'>
                    <div className='flex space-x-4'>
                      {MainStatus.map((status, index) => (
                        <div key={index} className='flex items-center'>
                          <input
                            id={status.name}
                            name='status'
                            type='radio'
                            value={status.value}
                            disabled={isView}
                            onChange={(e) => radioHandler(e)}
                            checked={status.value === form.status}
                            className={`w-5 h-5 border-gray-300 ${
                              isView ? 'cursor-default' : 'cursor-pointer'
                            } text-admin-primary focus:ring-admin-primary`}
                          />
                          <label
                            htmlFor={status.name}
                            className={`block ml-3 text-sm font-medium text-gray-700 ${
                              isView ? 'cursor-default' : 'cursor-pointer'
                            }`}
                          >
                            {status.name}
                          </label>
                        </div>
                      ))}
                    </div>
                  </fieldset>
                </div>
              </div>
              {isView ? (
                <div className='mt-12 ml-auto text-right'>
                  <SecondaryButton
                    btnText='Back'
                    btnType='button'
                    single={true}
                  />
                </div>
              ) : (
                <div className='flex items-center justify-center mt-12 md:block md:ml-auto md:text-right'>
                  <SecondaryButton btnText='Cancel' btnType='button' />
                  <PrimaryButton btnText='Submit' btnType='submit' />
                </div>
              )}
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default UserComponent;
