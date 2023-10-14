document.getElementById('sidebar').innerHTML = (
  <div class='relative flex flex-col flex-1 min-h-0 pt-0 bg-white border-r border-gray-200 dark:bg-gray-800 dark:border-gray-700'>
    <div class='flex flex-col flex-1 pt-5 pb-4 overflow-y-auto'>
      <div class='flex-1 px-3 space-y-1 bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700'>
        <ul class='pb-2 space-y-2'>
          <li>
            <button
              type='button'
              onClick='displayEnrollmentComponent()'
              class='flex items-center w-full p-2 text-base text-gray-900 transition duration-75 rounded-lg group hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700 active:text-green-200'
            >
              <svg
                class='flex-shrink-0 w-6 h-6 text-gray-500 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white'
                fill='currentColor'
                viewBox='0 0 20 20'
                xmlns='http://www.w3.org/2000/svg'
                aria-hidden='true'
              >
                <path d='M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z'></path>
              </svg>
              <span
                class='flex-1 ml-3 text-left whitespace-nowrap'
                sidebar-toggle-item=''
              >
                Enrollment
              </span>
            </button>

            <div class='absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-2 bg-gray-100 text-gray-800 rounded-lg p-2 text-sm opacity-0 group-hover:opacity-100 transition-opacity'>
              Tooltip Content
            </div>
          </li>
          <li>
            <button
              type='button'
              class='flex items-center w-full p-2 text-base text-gray-900 transition duration-75 rounded-lg group hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700'
            >
              <svg
                class='flex-shrink-0 w-6 h-6 text-gray-500 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white'
                fill='currentColor'
                viewBox='0 0 20 20'
                xmlns='http://www.w3.org/2000/svg'
                aria-hidden='true'
              >
                <path d='M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z' />
              </svg>
              <span
                class='flex-1 ml-3 text-left whitespace-nowrap'
                sidebar-toggle-item=''
              >
                Cash
              </span>
            </button>
          </li>
          <li>
            <button
              type='button'
              class='flex items-center w-full p-2 text-base text-gray-900 transition duration-75 rounded-lg group hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700'
            >
              <svg
                class='flex-shrink-0 w-6 h-6 text-gray-500 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white'
                fill='currentColor'
                viewBox='0 0 20 20'
                xmlns='http://www.w3.org/2000/svg'
                aria-hidden='true'
              >
                <path
                  fill-rule='evenodd'
                  d='M5 3a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2V5a2 2 0 00-2-2H5zm9 4a1 1 0 10-2 0v6a1 1 0 102 0V7zm-3 2a1 1 0 10-2 0v4a1 1 0 102 0V9zm-3 3a1 1 0 10-2 0v1a1 1 0 102 0v-1z'
                  clip-rule='evenodd'
                />
              </svg>
              <span
                class='flex-1 ml-3 text-left whitespace-nowrap'
                sidebar-toggle-item=''
              >
                Net Assets
              </span>
            </button>
          </li>
          <li>
            <button
              type='button'
              class='flex items-center w-full p-2 text-base text-gray-900 transition duration-75 rounded-lg group hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700'
            >
              <svg
                class='flex-shrink-0 w-6 h-6 text-gray-500 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white'
                fill='currentColor'
                viewBox='0 0 20 20'
                xmlns='http://www.w3.org/2000/svg'
                aria-hidden='true'
              >
                <path d='M9 2a1 1 0 000 2h2a1 1 0 100-2H9z' />
                <path
                  fill-rule='evenodd'
                  d='M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z'
                  clip-rule='evenodd'
                />
              </svg>
              <span
                class='flex-1 ml-3 text-left whitespace-nowrap'
                sidebar-toggle-item=''
              >
                Debt
              </span>
            </button>
          </li>
          <li>
            <button
              type='button'
              class='flex items-center w-full p-2 text-base text-gray-900 transition duration-75 rounded-lg group hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700'
            >
              <svg
                class='flex-shrink-0 w-6 h-6 text-gray-500 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white'
                fill='currentColor'
                viewBox='0 0 20 20'
                xmlns='http://www.w3.org/2000/svg'
                aria-hidden='true'
              >
                <path
                  fill-rule='evenodd'
                  d='M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z'
                  clip-rule='evenodd'
                />
              </svg>
              <span
                class='flex-1 ml-3 text-left whitespace-nowrap'
                sidebar-toggle-item=''
              >
                Income
              </span>
            </button>
          </li>
          <li>
            <button
              type='button'
              class='flex items-center w-full p-2 text-base text-gray-900 transition duration-75 rounded-lg group hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700'
            >
              <svg
                class='flex-shrink-0 w-6 h-6 text-gray-500 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white'
                fill='currentColor'
                viewBox='0 0 20 20'
                xmlns='http://www.w3.org/2000/svg'
                aria-hidden='true'
              >
                <path d='M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z'></path>
              </svg>
              <span
                class='flex-1 ml-3 text-left whitespace-nowrap'
                sidebar-toggle-item=''
              >
                Expense
              </span>
            </button>
          </li>

          <li>
            <button
              type='button'
              class='flex items-center w-full p-2 text-base text-gray-900 transition duration-75 rounded-lg group hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700'
            >
              <svg
                class='flex-shrink-0 w-6 h-6 text-gray-500 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white'
                fill='currentColor'
                viewBox='0 0 20 20'
                xmlns='http://www.w3.org/2000/svg'
              >
                <path
                  fill-rule='evenodd'
                  d='M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm2 10a1 1 0 10-2 0v3a1 1 0 102 0v-3zm2-3a1 1 0 011 1v5a1 1 0 11-2 0v-5a1 1 0 011-1zm4-1a1 1 0 10-2 0v7a1 1 0 102 0V8z'
                  clip-rule='evenodd'
                ></path>
              </svg>
              <span
                class='flex-1 ml-3 text-left whitespace-nowrap'
                sidebar-toggle-item=''
              >
                Test
              </span>
              <svg
                sidebar-toggle-item=''
                class='w-6 h-6'
                fill='currentColor'
                viewBox='0 0 20 20'
                xmlns='http://www.w3.org/2000/svg'
              >
                <path
                  fill-rule='evenodd'
                  d='M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z'
                  clip-rule='evenodd'
                ></path>
              </svg>
            </button>
            <ul id='dropdown-pages' class='hidden py-2 space-y-2'>
              <li>
                <a
                  href='http://localhost:1313/pages/pricing/'
                  class='flex items-center p-2 text-base text-gray-900 transition duration-75 rounded-lg pl-11 group hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700'
                >
                  Pricing
                </a>
              </li>
              <li>
                <a
                  href='http://localhost:1313/pages/maintenance/'
                  class='flex items-center p-2 text-base text-gray-900 transition duration-75 rounded-lg pl-11 group hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700'
                >
                  Maintenance
                </a>
              </li>
              <li>
                <a
                  href='http://localhost:1313/pages/404/'
                  class='flex items-center p-2 text-base text-gray-900 transition duration-75 rounded-lg pl-11 group hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700'
                >
                  404 not found
                </a>
              </li>
              <li>
                <a
                  href='http://localhost:1313/pages/500/'
                  class='flex items-center p-2 text-base text-gray-900 transition duration-75 rounded-lg pl-11 group hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700'
                >
                  500 server error
                </a>
              </li>
            </ul>
          </li>
          <li>
            <button
              type='button'
              class='flex items-center w-full p-2 text-base text-gray-900 transition duration-75 rounded-lg group hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700'
              aria-controls='dropdown-auth'
              data-collapse-toggle='dropdown-auth'
            >
              <svg
                class='flex-shrink-0 w-6 h-6 text-gray-500 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white'
                fill='currentColor'
                viewBox='0 0 20 20'
                xmlns='http://www.w3.org/2000/svg'
              >
                <path
                  fill-rule='evenodd'
                  d='M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z'
                  clip-rule='evenodd'
                ></path>
              </svg>
              <span
                class='flex-1 ml-3 text-left whitespace-nowrap'
                sidebar-toggle-item=''
              >
                Auth
              </span>
              <svg
                sidebar-toggle-item=''
                class='w-6 h-6'
                fill='currentColor'
                viewBox='0 0 20 20'
                xmlns='http://www.w3.org/2000/svg'
              >
                <path
                  fill-rule='evenodd'
                  d='M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z'
                  clip-rule='evenodd'
                ></path>
              </svg>
            </button>
            <ul id='dropdown-auth' class='hidden py-2 space-y-2'>
              <li>
                <a
                  href='http://localhost:1313/authentication/sign-in/'
                  class='flex items-center p-2 text-base text-gray-900 transition duration-75 rounded-lg pl-11 group hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700'
                >
                  Sign in
                </a>
              </li>
              <li>
                <a
                  href='http://localhost:1313/authentication/sign-up/'
                  class='flex items-center p-2 text-base text-gray-900 transition duration-75 rounded-lg pl-11 group hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700'
                >
                  Sign up
                </a>
              </li>
              <li>
                <a
                  href='http://localhost:1313/authentication/forgot-password/'
                  class='flex items-center p-2 text-base text-gray-900 transition duration-75 rounded-lg pl-11 group hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700'
                >
                  Forgot password
                </a>
              </li>
              <li>
                <a
                  href='http://localhost:1313/authentication/reset-password/'
                  class='flex items-center p-2 text-base text-gray-900 transition duration-75 rounded-lg pl-11 group hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700'
                >
                  Reset password
                </a>
              </li>
              <li>
                <a
                  href='http://localhost:1313/authentication/profile-lock/'
                  class='flex items-center p-2 text-base text-gray-900 transition duration-75 rounded-lg pl-11 group hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700'
                >
                  Profile lock
                </a>
              </li>
            </ul>
          </li>
        </ul>
        <div class='pt-2 space-y-2'>
          <a
            onClick='displayReportComponent()'
            target='_blank'
            class='flex items-center p-2 text-base text-gray-900 transition duration-75 rounded-lg hover:bg-gray-100 group dark:text-gray-200 dark:hover:bg-gray-700'
          >
            <svg
              class='flex-shrink-0 w-6 h-6 text-gray-500 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white'
              fill='currentColor'
              viewBox='0 0 20 20'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path d='M9 2a1 1 0 000 2h2a1 1 0 100-2H9z'></path>
              <path
                fill-rule='evenodd'
                d='M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z'
                clip-rule='evenodd'
              ></path>
            </svg>
            <span class='ml-3' sidebar-toggle-item=''>
              Reports
            </span>
          </a>
        </div>
      </div>
    </div>
  </div>
);
