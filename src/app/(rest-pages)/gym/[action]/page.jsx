/* eslint-disable no-unused-vars */
'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Breadcrumb from '@/app/components/common/Breadcrumb';
import Loader from '@/app/components/common/Loader';
import adminGymAddEditValidation from '@/app/validation/adminGymAddEditValidation';
import './fonts.css';
import LogoIcon from '@/public/assets/images/logo-upload-icon.png';
import {
  capitalize,
  errorToast,
  successToast,
  getFileType,
  capitalizeFirstWord,
} from '@/app/utils/helper';
import axios from 'axios';

import GymComponent from '@/app/components/PageComponents/users/GymComps';

export const FONT_TYPE = [
  // { name: 'Select Font', key: '' },
  { name: 'Roboto', key: 'roboto_sans' },
  { name: 'Montserrat', key: 'montserrat' },
  { name: 'Roboto Mono', key: 'roboto_mono' },
  { name: 'Outfit', key: 'outfit' },
  { name: 'Fira Code', key: 'fira_code' },
];
export const FONT_SIZE = [
  { name: 'small' },
  { name: 'medium' },
  { name: 'large' },
];
export const FONT_PREVIEW_DATA = {
  small: {
    header: {
      fontSize: 'text-[44px]',
      fontWeight: 'font-bold',
    },
    subheader: {
      fontSize: 'text-[30px]',
      fontWeight: 'font-semibold',
    },
    description: {
      fontSize: 'text-[16px]',
      fontWeight: 'font-normal',
    },
  },
  medium: {
    header: {
      fontSize: 'text-[56px]',
      fontWeight: 'font-bold',
    },
    subheader: {
      fontSize: 'text-[36px]',
      fontWeight: 'font-semibold',
    },
    description: {
      fontSize: 'text-[20px]',
      fontWeight: 'font-normal',
    },
  },
  large: {
    header: {
      fontSize: 'text-[72px]',
      fontWeight: 'font-bold',
    },
    subheader: {
      fontSize: 'text-[48px]',
      fontWeight: 'font-semibold',
    },
    description: {
      fontSize: 'text-[24px]',
      fontWeight: 'font-normal',
    },
  },
};
export const STATUS = [
  { name: 'Active', value: 1 },
  { name: 'Inactive', value: 0 },
];

const PerformActionsOnGym = ({ params }) => {
  const action = params.action;
  const router = useRouter();

  const imageRef = useRef(null);
  const selectRef = useRef(null);
  const [error, setError] = useState({});
  const [selectedFile, setSelectedFile] = useState();
  const [isView, setIsView] = useState(false);
  const [preview, setPreview] = useState('');
  const [userFontType, setUserFontType] = useState([]);
  const [selectedWorkoutMenu, setWorkoutSelectedMenu] = useState({});
  const [selectedSectionMenu, setSectionSelectedMenu] = useState({});
  const [selectedMovementMenu, setMovementSelectedMenu] = useState({});

  const [userFontSize, setUserFontSize] = useState([]);
  const [selectedSizeMenu, setSelectedSizeMenu] = useState({});

  const [previewFontData, setPreviewFontData] = useState(
    FONT_PREVIEW_DATA.medium
  );

  const [pages, setPages] = useState([
    { name: 'Gym', href: '/gym' },
    { name: `${capitalizeFirstWord(action)}`, href: `/gym/${action}` },
  ]);
  const [loader, setLoader] = useState(false);
  const [form, setForm] = useState({
    id: '',
    name: '',
    address: '',
    domain_name: '',
    about_us: '',
    contact_us: '',
    theme: '#000000',
    default_workout_count: 5,
    status: 1,
    workoutFontStyle: 'roboto_sans',
    sectionFontStyle: 'roboto_sans',
    movementFontStyle: 'roboto_sans',
    fontSize: 'medium',
  });
  const [isColorPickerOpen, setIsColorPickerOpen] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const { errors, isValid } = adminGymAddEditValidation(form);
    if (isValid) {
      setLoader(true);
      const payload = {
        id: form.id,
        name: capitalize(form.name),
        logo_url: selectedFile?.type ? getFileType(selectedFile) : null,
        address: form.address,
        domain_name: form.domain_name,
        about_us: form.about_us,
        contact_us: form.contact_us,
        theme: form.theme,
        default_workout_count: parseInt(form.default_workout_count),
        status: `${form.status}`,
        workout_font_style: selectedWorkoutMenu.key || form.workoutFontStyle,
        section_font_style: selectedSectionMenu.key || form.sectionFontStyle,
        movement_font_style: selectedMovementMenu.key || form.movementFontStyle,
        // section_font_style:
        font_size: selectedSizeMenu.name || form.fontSize,
      };
      try {
        const addEditGymRes = axios.post('/api/admin/gym', payload);
        const response = addEditGymRes.data;
        if (response) {
          if (response?.data?.meta?.code === 1) {
            if (response?.data?.meta?.logo_upload_url?.uploadURL) {
              axios
                .put(
                  response?.data?.meta?.logo_upload_url?.uploadURL,
                  selectedFile,
                  {
                    headers: {
                      'content-type': `${selectedFile?.type?.split('/')[0]}/${
                        selectedFile?.name?.split('.')[1]
                      }`,
                    },
                  }
                )
                .then((resp) => {
                  if (resp?.status === 200) {
                    setLoader(false);
                    successToast(response?.data?.meta?.message);
                    router.push('/gym');
                  }
                })
                .catch(() => {
                  errorToast('Something went wrong');
                });
            } else {
              setLoader(false);
              successToast(response?.data?.meta?.message);
              router.push('/gym');
            }
          } else if (response?.data?.meta?.code === 0) {
            setLoader(false);
            errorToast(response?.data?.meta?.message);
          } else {
            setLoader(false);
          }
        }
      } catch (error) {
        setLoader(false);
        errorToast(errors);
      }
    } else {
      setLoader(false);
      setError(errors);
    }
  };

  const handleChange = (e) => {
    setError((prevState) => ({
      ...prevState,
      [e.target.name]: '',
    }));

    setForm((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const radioHandler = (e) => {
    let { name, value } = e.target;
    setForm((prevData) => ({
      ...prevData,
      [name]: parseInt(value),
    }));
  };

  const onSelectFile = (e) => {
    if (!e.target.files || e.target.files.length === 0) {
      setSelectedFile(undefined);
      return;
    }
    if (e?.target?.files[0]) {
      if (!e?.target?.files[0].name.match(/\.(jpg|jpeg|png)$/i)) {
        errorToast(
          `The specified file ${e?.target?.files[0].name} could not be uploaded. Please upload valid image.`
        );
      } else {
        setSelectedFile(e.target.files[0]);
        const objectUrl = URL.createObjectURL(e.target.files[0]);
        setPreview(objectUrl);
        // free memory when ever this component is unmounted
        return () => URL.revokeObjectURL(objectUrl);
      }
    } else {
      setPreview(undefined);
    }
  };

  const handleWorkOutMenuChange = (menu) => {
    if (menu) {
      setWorkoutSelectedMenu(menu);
    }
  };

  const handleSectionMenuChange = (menu) => {
    if (menu) {
      setSectionSelectedMenu(menu);
    }
  };

  const handleMovementChange = (menu) => {
    if (menu) {
      setMovementSelectedMenu(menu);
    }
  };

  const handleSizeMenuChange = (menu) => {
    if (menu) {
      setSelectedSizeMenu(menu);
      if (menu.name === 'small') {
        setPreviewFontData(FONT_PREVIEW_DATA.small);
      } else if (menu.name === 'medium') {
        setPreviewFontData(FONT_PREVIEW_DATA.medium);
      } else if (menu.name === 'large') {
        setPreviewFontData(FONT_PREVIEW_DATA.large);
      }
    }
  };

  const addFontList = () => {
    setWorkoutSelectedMenu(FONT_TYPE[0]);
    setSectionSelectedMenu(FONT_TYPE[0]);
    setMovementSelectedMenu(FONT_TYPE[0]);
    setUserFontType(FONT_TYPE);
    setSelectedSizeMenu(FONT_SIZE[1]);
    setUserFontSize(FONT_SIZE);
  };

  const editFontList = (data) => {
    const matchedWorkoutFont = FONT_TYPE.find(
      (font) => font.key === data.workout_font_style
    );

    const prevWorkoutSelectedMenu = FONT_TYPE.filter(
      (itx) => itx.name === matchedWorkoutFont.name
    );
    setWorkoutSelectedMenu(prevWorkoutSelectedMenu[0]);

    const matchedSectionFont = FONT_TYPE.find(
      (font) => font.key === data.section_font_style
    );

    const prevSectionSelectedMenu = FONT_TYPE.filter(
      (itx) => itx.name === matchedSectionFont.name
    );
    setSectionSelectedMenu(prevSectionSelectedMenu[0]);

    const matchedMovementFont = FONT_TYPE.find(
      (font) => font.key === data.movement_font_style
    );

    const prevMovementSelectedMenu = FONT_TYPE.filter(
      (itx) => itx.name === matchedMovementFont.name
    );
    setMovementSelectedMenu(prevMovementSelectedMenu[0]);

    // const newData = FONT_TYPE.slice(1);
    setUserFontType(FONT_TYPE);

    const prevSelectedSizeMenu = FONT_SIZE.filter(
      (itx) => itx.name === data.font_size
    );
    setSelectedSizeMenu(prevSelectedSizeMenu[0]);

    setUserFontSize(FONT_SIZE);
    setPreviewFontData(FONT_PREVIEW_DATA[data.font_size]);
  };

  const viewFontList = (data) => {
    const matchedWorkOutFont = FONT_TYPE.find(
      (font) => font.key === data.workout_font_style
    );
    const defaultWorkoutMenu = [
      { name: matchedWorkOutFont.name, value: matchedWorkOutFont.name },
    ];
    const matchedSectionFont = FONT_TYPE.find(
      (font) => font.key === data.section_font_style
    );
    const defaultSectionMenu = [
      { name: matchedSectionFont.name, value: matchedSectionFont.name },
    ];
    const matchedMovementFont = FONT_TYPE.find(
      (font) => font.key === data.movement_font_style
    );
    const defaultMovementMenu = [
      { name: matchedMovementFont.name, value: matchedMovementFont.name },
    ];
    setWorkoutSelectedMenu(defaultWorkoutMenu[0]);
    setSectionSelectedMenu(defaultSectionMenu[0]);
    setMovementSelectedMenu(defaultMovementMenu[0]);
    setUserFontType(defaultWorkoutMenu);

    const defaultSizeMenu = [{ name: data.font_size, value: data.font_size }];
    setSelectedSizeMenu(defaultSizeMenu[0]);
    setUserFontSize(defaultSizeMenu);
    setPreviewFontData(FONT_PREVIEW_DATA[data.font_size]);
  };

  const setActionTitle = (action) => {
    switch (action) {
      case 'add':
        return 'Add Gym';
      case 'edit':
        return 'Edit Gym';
      case 'view':
        return 'Gym Details';
      default:
        return '';
    }
  };

  useEffect(() => {
    if (action === 'view' || action === 'edit') {
      setLoader(true);
      setPages([
        { name: 'Gym', href: '/gym' },
        {
          name: `${setActionTitle(action)}`,
          href: `/gym/${action}`,
        },
      ]);
      setIsView(action === 'view');
      try {
        const getGymIdRes = axios.get(`/api/admin/gym/${params.id}`, true);
        const response = getGymIdRes.data;
        if (response) {
          const singleGymData = response?.data?.data;
          if (response?.data?.meta?.code === 1) {
            setForm({
              id: singleGymData.id || '',
              name: singleGymData.name || '',
              address: singleGymData.address || '',
              domain_name: singleGymData.domain_name || '',
              about_us: singleGymData.about_us || '',
              contact_us: singleGymData.contact_us || '',
              theme: singleGymData.theme || '',
              default_workout_count: parseInt(
                singleGymData.default_workout_count
              ),
              status: parseInt(singleGymData.status),
              fontSize: singleGymData.font_size || 'medium',
              workoutFontStyle:
                singleGymData.workout_font_style || 'roboto_sans',
              sectionFontStyle:
                singleGymData.section_font_style || 'roboto_sans',
              movementFontStyle:
                singleGymData.movement_font_style || 'roboto_sans',
            });
            if (action === 'view') {
              viewFontList(singleGymData);
            }
            if (action === 'edit') {
              editFontList(singleGymData);
            }
            setPreview(singleGymData?.logo_url);
            setLoader(false);
          } else if (response?.code === 401) {
            setLoader(false);
            errorToast(response?.message);
          } else if (response?.data?.meta?.code === 0) {
            setLoader(false);
            errorToast(response?.data?.meta?.message);
          } else {
            setLoader(false);
          }
        }
      } catch (error) {
        setLoader(false);
        errorToast(error);
      }
    }
  }, []);

  useEffect(() => {
    if (action === 'add') addFontList();
  }, [action]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectRef.current && !selectRef.current.contains(event.target)) {
        setIsColorPickerOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [selectRef]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setIsColorPickerOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isColorPickerOpen]);

  return (
    <>
      {loader && <Loader />}
      <Breadcrumb pageList={pages} />
      {!loader && (
        <>
          <GymComponent
            form={form}
            error={error}
            isView={isView}
            MainStatus={STATUS}
            action={action}
            radioHandler={radioHandler}
            handleSubmit={handleSubmit}
            handleChange={handleChange}
            onSelectFile={onSelectFile}
            selectRef={selectRef}
            imageRef={imageRef}
            loader={loader}
            preview={preview}
            LogoIcon={LogoIcon}
            isColorPickerOpen={isColorPickerOpen}
            setIsColorPickerOpen={setIsColorPickerOpen}
            setForm={setForm}
            userFontType={userFontType}
            selectedWorkoutMenu={selectedWorkoutMenu}
            handleWorkOutMenuChange={handleWorkOutMenuChange}
            selectedSectionMenu={selectedSectionMenu}
            handleSectionMenuChange={handleSectionMenuChange}
            selectedMovementMenu={selectedMovementMenu}
            handleMovementChange={handleMovementChange}
            userFontSize={userFontSize}
            selectedSizeMenu={selectedSizeMenu}
            handleSizeMenuChange={handleSizeMenuChange}
            previewFontData={previewFontData}
          />
        </>
      )}
    </>
  );
};

export default PerformActionsOnGym;
