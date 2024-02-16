'use client';

import PrimaryButton from '@/components/common/Buttons/PrimaryButton';
import SecondaryButton from '@/components/common/Buttons/SecondaryButton';
import CommonInput from '@/components/common/Input/CommonInput';
import SelectMenu from '@/components/common/SelectMenu';
import LazyLoadImageProp from '@/components/common/LazyLoadImage';
import ColorPicker from 'react-pick-color';
import { HiCamera } from 'react-icons/hi2';
import { truncateParagraph } from '@/lib/utils';

interface GymComponentProps {
  form: any;
  error: any;
  isView: boolean;
  MainStatus: any;
  action: string;
  radioHandler: any;
  handleSubmit: any;
  handleChange: any;
  onSelectFile: any;
  selectRef: any;
  imageRef: any;
  loader: boolean;
  preview: any;
  LogoIcon: any;
  isColorPickerOpen: boolean;
  setIsColorPickerOpen: any;
  setForm: any;
  userFontType: any;
  selectedWorkoutMenu: any;
  handleWorkOutMenuChange: any;
  selectedSectionMenu: any;
  handleSectionMenuChange: any;
  selectedMovementMenu: any;
  handleMovementChange: any;
  userFontSize: any;
  selectedSizeMenu: any;
  handleSizeMenuChange: any;
  previewFontData: any;
}

const GymComponent = ({
  form,
  error,
  isView,
  MainStatus,
  action,
  radioHandler,
  handleSubmit,
  handleChange,
  onSelectFile,
  selectRef,
  imageRef,
  loader,
  preview,
  LogoIcon,
  isColorPickerOpen,
  setIsColorPickerOpen,
  setForm,
  userFontType,
  selectedWorkoutMenu,
  handleWorkOutMenuChange,
  selectedSectionMenu,
  handleSectionMenuChange,
  selectedMovementMenu,
  handleMovementChange,
  userFontSize,
  selectedSizeMenu,
  handleSizeMenuChange,
  previewFontData,
}: GymComponentProps) => {
  return (
    <div className='mt-6'>
      <form onSubmit={handleSubmit}>
        <div className='flex flex-col items-start px-4 py-10 rounded-[10px] bg-white gap-4'>
          <div className='grid items-center justify-center w-full gap-4 md:gap-6 md:grid-cols-6 md:grid-rows-2 xl:grid-cols-12 place-items-center'>
            <div className='mb-auto md:row-span-1 md:col-span-1'>
              <div className='flex flex-col items-center gap-y-2'>
                <label className='block text-sm font-medium text-center text-gray-700'>
                  {isView ? 'Uploaded Logo' : 'Upload Logo'}
                </label>
                <input
                  onChange={onSelectFile}
                  className='hidden'
                  disabled={isView}
                  ref={imageRef}
                  type='file'
                  accept='.jpg, .jpeg, .png'
                />
                <div className=''>
                  {!loader ? (
                    <div
                      className={`relative m-auto w-[100px] rounded-[50%] ${
                        isView ? 'cursor-default' : 'cursor-pointer'
                      }`}
                      onClick={() => {
                        imageRef?.current?.click();
                      }}
                    >
                      <LazyLoadImageProp
                        imageSrc={preview || LogoIcon}
                        className={
                          'border border-gray-300 w-[100px] h-[100px] p-2 rounded-lg m-auto'
                        }
                      />

                      <div className='absolute -bottom-1 -right-4 bg-gray-200 p-2 rounded-[50%]'>
                        <HiCamera className='w-[20px]' />
                      </div>
                    </div>
                  ) : (
                    <div className='relative m-auto w-[100px] rounded-[50%]'></div>
                  )}
                </div>
              </div>
            </div>
            <div className='grid w-full gap-4 mb-auto xl:col-span-6 md:row-span-1 md:col-span-5 sm:grid-cols-2'>
              <CommonInput
                id='name'
                name='name'
                type='text'
                value={form.name}
                disabled={isView || action === 'edit'}
                onChange={handleChange}
                label='Name'
                error={error.name}
                isRequired
              />
              <CommonInput
                id='address'
                name='address'
                type='text'
                value={form.address}
                disabled={isView}
                onChange={handleChange}
                label='Address'
                isRequired={false}
                error={''}
              />
              <CommonInput
                id='domain_name'
                name='domain_name'
                type='text'
                value={form.domain_name}
                disabled={isView || action === 'edit'}
                onChange={handleChange}
                label='Domain Name'
                error={error.domain_name}
                domain_url_name='.dhrumilmehta.tech'
                isRequired
              />
              <div className='relative'>
                <div
                  className='cursor-pointer'
                  onClick={() => setIsColorPickerOpen(!isColorPickerOpen)}
                >
                  <label className='block text-sm font-medium text-gray-700'>
                    Theme
                  </label>
                  <div
                    className={`mt-1 block w-full rounded-3xl appearance-none border border-gray-300 px-3 py-2 focus:border-admin-primary focus:outline-none focus:ring-admin-primary sm:text-sm ${
                      isView && 'bg-gray-50 cursor-default'
                    }`}
                  >
                    {form.theme}
                  </div>
                </div>
                <div
                  title='Select Color'
                  style={{ backgroundColor: form?.theme || '#000000' }}
                  className={`absolute w-5 h-5 rounded-md ${
                    isView ? 'cursor-default' : 'cursor-pointer'
                  } right-3 bottom-2`}
                  onClick={() => setIsColorPickerOpen(!isColorPickerOpen)}
                />
                {!isView && isColorPickerOpen && (
                  <div ref={selectRef} className='absolute right-0 z-50'>
                    <ColorPicker
                      color={form?.theme}
                      onChange={(color) => {
                        setForm((prevState: any) => ({
                          ...prevState,
                          theme: color.hex,
                        }));
                      }}
                    />
                  </div>
                )}
              </div>
              <div>
                <SelectMenu
                  menuList={userFontType}
                  label={
                    action === 'view'
                      ? 'Workout Header Text Style'
                      : 'Select Workout Header Text Style'
                  }
                  disabled={isView}
                  defaultSelected={selectedWorkoutMenu}
                  setSelectedMenu={handleWorkOutMenuChange}
                  isRequired={false}
                />
              </div>
              <div>
                <SelectMenu
                  menuList={userFontType}
                  label={
                    action === 'view'
                      ? 'Section Header Text Style'
                      : 'Select Section Header Text Style'
                  }
                  disabled={isView}
                  defaultSelected={selectedSectionMenu}
                  setSelectedMenu={handleSectionMenuChange}
                  isRequired={false}
                />
              </div>
              <div>
                <SelectMenu
                  menuList={userFontType}
                  label={
                    action === 'view'
                      ? 'Movement Header Text Style'
                      : 'Select Movement Header Text Style'
                  }
                  disabled={isView}
                  defaultSelected={selectedMovementMenu}
                  setSelectedMenu={handleMovementChange}
                  isRequired={false}
                />
              </div>
              <div>
                <SelectMenu
                  menuList={userFontSize}
                  label={action === 'view' ? 'Font Size' : 'Select Font Size'}
                  disabled={isView}
                  defaultSelected={selectedSizeMenu}
                  setSelectedMenu={handleSizeMenuChange}
                  isRequired={false}
                />
              </div>
              <CommonInput
                id='default_workout_count'
                name='default_workout_count'
                type='number'
                disabled={isView}
                value={form.default_workout_count}
                onChange={handleChange}
                label='Workout Count'
                error={error.default_workout_count}
                isRequired
                // min={0}
              />
              <div>
                <label className='block text-sm font-medium text-gray-700'>
                  Status
                </label>
                <fieldset className='mt-4'>
                  <div className='flex space-x-4'>
                    {MainStatus.map((status: any, index: number) => {
                      return (
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
                      );
                    })}
                  </div>
                </fieldset>
              </div>

              {isView ? (
                <>
                  <div />
                  <div className='mt-12 ml-auto md:text-right'>
                    <SecondaryButton
                      btnText='Back'
                      btnType='button'
                      single={true}
                    />
                  </div>
                </>
              ) : (
                <>
                  <div />
                  <div className='flex items-center justify-center mt-12 md:flex-row lg:ml-auto md:text-right'>
                    <SecondaryButton btnText='Cancel' btnType='button' />
                    <PrimaryButton
                      btnText='Submit'
                      btnType='submit'
                      disabled={false}
                    />
                  </div>
                </>
              )}
            </div>
            <div className='flex flex-col items-center md:row-span-1 md:col-span-6 bg-[#F9F9FA] w-full h-full xl:col-span-5 rounded-xl p-8 '>
              <p
                className={`mr-auto capitalize ${previewFontData.header.fontSize} ${previewFontData.header.fontWeight}`}
                style={{
                  fontFamily:
                    selectedWorkoutMenu.name == 'Roboto Sans'
                      ? 'Roboto'
                      : selectedWorkoutMenu.name,
                }}
              >
                {selectedSizeMenu.name === 'large'
                  ? truncateParagraph(`This is the heading`, 3)
                  : 'This is the heading'}
              </p>
              <p
                className={`mr-auto capitalize ${previewFontData.subheader.fontSize} ${previewFontData.subheader.fontWeight}`}
                style={{
                  fontFamily:
                    selectedSectionMenu.name == 'Roboto Sans'
                      ? 'Roboto'
                      : selectedSectionMenu.name,
                }}
              >
                This is the sub heading
              </p>
              <p
                className={`mr-auto ${previewFontData.description.fontSize} ${previewFontData.description.fontWeight}`}
                style={{
                  fontFamily:
                    selectedMovementMenu.name == 'Roboto Sans'
                      ? 'Roboto'
                      : selectedMovementMenu.name,
                }}
              >
                Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                Temporibus ut in nisi officiis maiores quis error exercitationem
                necessitatibus accusamus sapiente! Excepturi dolores architecto
                sed reprehenderit illo vitae quaerat repudiandae quas.
              </p>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default GymComponent;
